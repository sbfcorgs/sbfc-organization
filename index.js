// ============================================================
// SBFC Organization — Cloudflare Worker
// Handles authentication, protected finance data, and static assets.
// ============================================================

const SESSION_COOKIE = "sbfc_session";
const SESSION_TTL_SECONDS = 20 * 60;

const ALLOWED_ORIGINS = new Set([
  "https://sbfcorgs.com",
  "https://www.sbfcorgs.com",
]);
function corsHeaders(request) {
  const origin = request?.headers.get("Origin");
  // Credentials require one exact origin, never a wildcard.
  const allowedOrigin = ALLOWED_ORIGINS.has(origin) ? origin : "https://sbfcorgs.com";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true",
    "Vary": "Origin",
  };
}
function withCors(response, request) {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(corsHeaders(request))) headers.set(name, value);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...corsHeaders() },
  });
}

function getCookie(request, name) {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(new RegExp("(?:^|;\\s*)" + name + "=([^;]+)"));
  return match ? match[1] : null;
}

function sessionCookieHeader(sessionId, maxAgeSeconds) {
  return `${SESSION_COOKIE}=${sessionId}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=${maxAgeSeconds}`;
}

function clearCookieHeader() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0`;
}

async function getSession(env, request) {
  const sid = getCookie(request, SESSION_COOKIE);
  if (!sid) return null;

  const row = await env.DB.prepare(
    "SELECT session_id, admin_id, username, role, expires_at FROM sessions WHERE session_id = ?",
  )
    .bind(sid)
    .first();

  if (!row) return null;
  if (row.expires_at < Math.floor(Date.now() / 1000)) {
    await env.DB.prepare("DELETE FROM sessions WHERE session_id = ?")
      .bind(sid)
      .run();
    return null;
  }
  return row;
}

async function touchSession(env, sessionId) {
  const now = Math.floor(Date.now() / 1000);
  await env.DB.prepare(
    "UPDATE sessions SET last_seen = ?, expires_at = ? WHERE session_id = ?",
  )
    .bind(now, now + SESSION_TTL_SECONDS, sessionId)
    .run();
}

async function handleLoginResponse(request, env) {
  let body;
  const contentType = request.headers.get("Content-Type") || "";
  if (contentType.includes("application/json")) {
    body = await request.json();
  } else {
    const form = await request.formData();
    body = { username: form.get("username"), password: form.get("password"), role: form.get("role") };
  }

  const username = String(body.username || "").trim();
  const password = String(body.password || "");
  const requestedRole = String(body.role || "").trim().toLowerCase();
  if (!username || !password) {
    return json({ ok: false, error: "Username and password required." }, 400);
  }
  if (requestedRole && !["admin", "user"].includes(requestedRole)) {
    return json({ ok: false, error: "Invalid account role." }, 400);
  }

  const row = await env.DB.prepare(
    "SELECT id, password, role FROM admins WHERE username = ?",
  )
    .bind(username)
    .first();

  if (!row || row.password !== password || (requestedRole && row.role !== requestedRole)) {
    return json({ ok: false, error: "Incorrect username, password, or selected role." }, 401);
  }

  const sessionId = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);
  await env.DB.prepare(
    "INSERT INTO sessions (session_id, admin_id, username, role, created_at, last_seen, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
  )
    .bind(
      sessionId,
      row.id,
      username,
      row.role,
      now,
      now,
      now + SESSION_TTL_SECONDS,
    )
    .run();

  const res = json({ ok: true, username, role: row.role });
  res.headers.append(
    "Set-Cookie",
    sessionCookieHeader(sessionId, SESSION_TTL_SECONDS),
  );
  return res;
}

async function handleLogout(request, env) {
  const sid = getCookie(request, SESSION_COOKIE);
  if (sid)
    await env.DB.prepare("DELETE FROM sessions WHERE session_id = ?")
      .bind(sid)
      .run();
  const res = json({ ok: true });
  res.headers.append("Set-Cookie", clearCookieHeader());
  return res;
}

async function handleMe(request, env) {
  const session = await getSession(env, request);
  if (!session) return json({ ok: false }, 401);
  await touchSession(env, session.session_id);
  return json({ ok: true, username: session.username, role: session.role });
}

function financeGroup(transactionType) {
  const type = String(transactionType || "")
    .trim()
    .toLowerCase();
  if (type === "share") return "income";
  if (type === "deposit to bank") return "savings";
  if (type === "bank charge") return "expense";
  return "other";
}

async function handleFinance(request, env) {
  const session = await getSession(env, request);
  if (!session)
    return json({ ok: false, error: "Authentication required." }, 401);
  await touchSession(env, session.session_id);

  try {
    const result = await env.DB.prepare(
      `
      SELECT entry_id, "date" AS date, member_id, full_name,
             transaction_type, amount, note, remark
      FROM sbfc_saving
      ORDER BY "date" DESC, entry_id DESC
    `,
    ).all();

    const groups = {
      income: { label: "Share", total: 0, rows: [] },
      savings: { label: "Deposit To Bank", total: 0, rows: [] },
      expense: { label: "Bank Charge", total: 0, rows: [] },
      other: { label: "Other Transactions", total: 0, rows: [] },
    };
    let invalidAmountCount = 0;

    for (const record of result.results || []) {
      const amount = Number(record.amount);
      if (!Number.isFinite(amount)) {
        invalidAmountCount++;
        continue;
      }
      const key = financeGroup(record.transaction_type);
      const row = {
        entry_id: record.entry_id,
        date: record.date || "",
        member_id: record.member_id || "",
        full_name: record.full_name || "",
        transaction_type: record.transaction_type || "",
        amount,
        note: record.note || "",
        remark: record.remark || "",
      };
      groups[key].rows.push(row);
      groups[key].total += amount;
    }

    return json({
      ok: true,
      groups,
      summary: {
        income: groups.income.total,
        savings: groups.savings.total,
        expense: groups.expense.total,
        other: groups.other.total,
        // Deposits are transfers, so they are deliberately excluded from net.
        net: groups.income.total - groups.expense.total,
      },
      meta: { invalidAmountCount, updatedAt: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Finance API error:", error);
    return json({ ok: false, error: "Finance data could not be loaded." }, 500);
  }
}

function numberAmount(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
}

async function handleDashboard(request, env) {
  const session = await getSession(env, request);
  if (!session)
    return json({ ok: false, error: "Authentication required." }, 401);
  await touchSession(env, session.session_id);
  try {
    const [donationsResult, savingsResult, visitorTotalResult, visitorOnlineResult] = await env.DB.batch([
      env.DB
        .prepare(`SELECT id, name, email, amount, payment_method, tr_id, status, created_at
                      FROM donations
                      ORDER BY CASE status WHEN 'pending' THEN 0 WHEN 'approved' THEN 1 ELSE 2 END, created_at DESC`),
      env.DB.prepare(
        `SELECT transaction_type, amount, member_id FROM sbfc_saving`,
      ),
      // Existing visitor tables only: latest aggregate and active visitor pings.
      env.DB.prepare(`SELECT total FROM visitor_stats ORDER BY id DESC LIMIT 1`),
      env.DB.prepare(
        `SELECT COUNT(*) AS online FROM visitor_online
         WHERE last_seen >= datetime('now', '-5 minutes')`,
      ),
    ]);
    const donations = (donationsResult.results || []).map((row) => ({
      ...row,
      amount: numberAmount(row.amount),
    }));
    const visitorStats = {
      total: numberAmount(visitorTotalResult.results?.[0]?.total),
      online: numberAmount(visitorOnlineResult.results?.[0]?.online),
    };
    const donationStats = {
      total: donations.length,
      approved: 0,
      pending: 0,
      rejected: 0,
      approvedAmount: 0,
      pendingAmount: 0,
    };
    for (const donation of donations) {
      const status = String(donation.status || "pending").toLowerCase();
      if (status === "approved") {
        donationStats.approved++;
        donationStats.approvedAmount += donation.amount;
      } else if (status === "rejected") donationStats.rejected++;
      else {
        donationStats.pending++;
        donationStats.pendingAmount += donation.amount;
      }
    }
    const transactionTotals = {};
    const memberIds = new Set();
    for (const row of savingsResult.results || []) {
      const type = row.transaction_type || "Other";
      transactionTotals[type] =
        (transactionTotals[type] || 0) + numberAmount(row.amount);
      if (row.member_id) memberIds.add(String(row.member_id));
    }
    const total = (type) => transactionTotals[type] || 0;
    const cashIn =
      total("Share") +
      total("Profit") +
      total("Return Loan") +
      total("Business Loan Return") +
      total("Withdraw From Bank");
    const cashOut =
      total("Loan") +
      total("Business Loan") +
      total("Cost") +
      total("Deposit To Bank");
    return json({
      ok: true,
      user: {
        username: session.username,
        role: session.role,
        viewOnly: session.role === "user",
      },
      donations,
      donationStats,
      visitorStats,
      savings: {
        transactionTotals,
        cashIn,
        cashOut,
        cashInHand: cashIn - cashOut,
        transactionCount: (savingsResult.results || []).length,
        members: memberIds.size,
      },
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return json(
      { ok: false, error: "Dashboard data could not be loaded." },
      500,
    );
  }
}

async function handleDonationStatus(request, env, id) {
  const session = await getSession(env, request);
  if (!session)
    return json({ ok: false, error: "Authentication required." }, 401);
  if (session.role === "user")
    return json(
      { ok: false, error: "View-only accounts cannot approve donations." },
      403,
    );
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400);
  }
  const status = String(body.status || "").toLowerCase();
  if (!["approved", "rejected"].includes(status))
    return json({ ok: false, error: "Invalid donation status." }, 400);
  const result = await env.DB.prepare(
    "UPDATE donations SET status = ? WHERE id = ?",
  )
    .bind(status, id)
    .run();
  if (!result.meta?.changes)
    return json({ ok: false, error: "Donation was not found." }, 404);
  await touchSession(env, session.session_id);
  return json({ ok: true, id, status });
}


// Savings-report endpoints — reads the existing sbfc_saving table.
function reportNumber(value) { const number = Number(value || 0); return Number.isFinite(number) ? number : 0; }
function reportRowNumbers(row) {
  const numeric = new Set(['total_share','total_share_return','personal_loan','personal_return','biz_loan','biz_return','share','share_return','profit','loan','loan_return','cnt']);
  return Object.fromEntries(Object.entries(row).map(([key, value]) => [key, numeric.has(key) ? reportNumber(value) : value]));
}
async function handleSavingsReport(request, env) {
  const session = await getSession(env, request);
  if (!session) return json({ ok:false, error:'Authentication required.' }, 401);
  await touchSession(env, session.session_id);
  try {
    const [types, bank, monthly, shareDetails, memberLoans, memberSummary] = await env.DB.batch([
      env.DB.prepare(`SELECT transaction_type, COALESCE(SUM(amount),0) total, COUNT(*) cnt FROM sbfc_saving GROUP BY transaction_type`),
      env.DB.prepare(`SELECT full_name FROM sbfc_saving WHERE transaction_type IN ('Deposit To Bank','Withdraw From Bank','Bank Profit','Bank Charge') AND full_name IS NOT NULL AND full_name <> '' ORDER BY CASE transaction_type WHEN 'Deposit To Bank' THEN 1 WHEN 'Withdraw From Bank' THEN 2 WHEN 'Bank Profit' THEN 3 WHEN 'Bank Charge' THEN 4 END LIMIT 1`),
      env.DB.prepare(`SELECT strftime('%Y-%m',date) mon, COALESCE(SUM(CASE WHEN transaction_type IN ('Share','Profit','Return Loan','Business Loan Return','Withdraw From Bank') THEN amount ELSE 0 END),0) cash_in, COALESCE(SUM(CASE WHEN transaction_type IN ('Loan','Business Loan','Cost','Share Return','Deposit To Bank') THEN amount ELSE 0 END),0) cash_out FROM sbfc_saving GROUP BY mon ORDER BY mon DESC LIMIT 12`),
      env.DB.prepare(`SELECT member_id, full_name, COALESCE(SUM(CASE WHEN transaction_type='Share' THEN amount ELSE 0 END),0) total_share, COALESCE(SUM(CASE WHEN transaction_type='Share Return' THEN amount ELSE 0 END),0) total_share_return, SUM(CASE WHEN transaction_type='Share' THEN 1 ELSE 0 END) cnt, MIN(CASE WHEN transaction_type='Share' THEN date END) first_date, MAX(CASE WHEN transaction_type='Share' THEN date END) last_date FROM sbfc_saving WHERE transaction_type IN ('Share','Share Return') GROUP BY member_id,full_name ORDER BY member_id`),
      env.DB.prepare(`SELECT member_id,full_name,COALESCE(SUM(CASE WHEN transaction_type='Loan' THEN amount ELSE 0 END),0) personal_loan,COALESCE(SUM(CASE WHEN transaction_type='Return Loan' THEN amount ELSE 0 END),0) personal_return,COALESCE(SUM(CASE WHEN transaction_type='Business Loan' THEN amount ELSE 0 END),0) biz_loan,COALESCE(SUM(CASE WHEN transaction_type='Business Loan Return' THEN amount ELSE 0 END),0) biz_return FROM sbfc_saving WHERE transaction_type IN ('Loan','Return Loan','Business Loan','Business Loan Return') GROUP BY member_id,full_name ORDER BY member_id`),
      env.DB.prepare(`SELECT member_id,full_name,COALESCE(SUM(CASE WHEN transaction_type='Share' THEN amount ELSE 0 END),0) share,COALESCE(SUM(CASE WHEN transaction_type='Share Return' THEN amount ELSE 0 END),0) share_return,COALESCE(SUM(CASE WHEN transaction_type='Profit' THEN amount ELSE 0 END),0) profit,COALESCE(SUM(CASE WHEN transaction_type='Loan' THEN amount ELSE 0 END),0) loan,COALESCE(SUM(CASE WHEN transaction_type='Return Loan' THEN amount ELSE 0 END),0) loan_return FROM sbfc_saving WHERE member_id IS NOT NULL AND member_id <> '' GROUP BY member_id,full_name ORDER BY member_id`),
    ]);
    const totalsByType={}, countsByType={};
    for (const row of types.results || []) { totalsByType[row.transaction_type]=reportNumber(row.total); countsByType[row.transaction_type]=reportNumber(row.cnt); }
    const total = key => reportNumber(totalsByType[key]);
    const cashShare=total('Share'), cashShareReturn=total('Share Return'), cashProfit=total('Profit'), cashCost=total('Cost'), cashLoanOut=total('Loan'), cashLoanReturn=total('Return Loan'), cashBizOut=total('Business Loan'), cashBizReturn=total('Business Loan Return'), cashDeposit=total('Deposit To Bank'), cashWithdraw=total('Withdraw From Bank'), bankProfit=total('Bank Profit'), bankCharge=total('Bank Charge');
    const totalCashIn=cashShare+cashProfit+cashLoanReturn+cashBizReturn+cashWithdraw;
    const totalCashOut=cashLoanOut+cashBizOut+cashCost+cashShareReturn+cashDeposit;
    const cashInHand=totalCashIn-totalCashOut, loanBalance=cashLoanOut-cashLoanReturn, bizLoanBalance=cashBizOut-cashBizReturn, bankBalance=cashDeposit-cashWithdraw+bankProfit-bankCharge;
    const totalAssets=cashInHand+bankBalance+loanBalance+bizLoanBalance, totalExpected=cashShare+cashProfit+bankProfit-cashCost-bankCharge-cashShareReturn;
    return json({ok:true, totalsByType, countsByType, bankAccountName:bank?.full_name||'Bank Account', calculations:{cashShare,cashShareReturn,cashProfit,cashCost,cashLoanOut,cashLoanReturn,cashBizOut,cashBizReturn,cashDeposit,cashWithdraw,bankProfit,bankCharge,totalCashIn,totalCashOut,cashInHand,loanBalance,bizLoanBalance,bankBalance,totalAssets,totalExpected,shortExcess:totalAssets-totalExpected}, monthlyCashFlow:(monthly.results||[]).reverse().map(row=>({...row,cash_in:reportNumber(row.cash_in),cash_out:reportNumber(row.cash_out)})), typeBreakdown:(types.results||[]).map(row=>({...row,total:reportNumber(row.total),cnt:reportNumber(row.cnt)})), shareDetails:(shareDetails.results||[]).map(reportRowNumbers), memberLoans:(memberLoans.results||[]).map(reportRowNumbers), memberSummary:(memberSummary.results||[]).map(reportRowNumbers)});
  } catch (error) { console.error('Savings report error:',error); return json({ok:false,error:'Savings report could not be loaded.'},500); }
}
async function handleSavingsHistory(request, env) {
  const session=await getSession(env, request);
  if (!session) return json({ok:false,error:'Authentication required.'},401);
  await touchSession(env,session.session_id);
  const url=new URL(request.url), member=url.searchParams.get('member_id'), type=url.searchParams.get('transaction_type');
  let sql=`SELECT entry_id, "date" AS date, member_id, full_name, transaction_type, amount, note, remark FROM sbfc_saving WHERE 1=1`, bindings=[];
  if(member){sql+=' AND member_id=?';bindings.push(member);}
  if(type){sql+=' AND transaction_type=?';bindings.push(type);}
  sql+=' ORDER BY "date" DESC, entry_id DESC';
  try { const result=await env.DB.prepare(sql).bind(...bindings).all(); return json({ok:true,records:(result.results||[]).map(row=>({...row,amount:reportNumber(row.amount)}))}); }
  catch(error) { console.error('Savings history error:',error); return json({ok:false,error:'Transaction history could not be loaded.'},500); }
}


async function handlePublicContact(request, env) {
  try { const b=await request.json(); const name=String(b.name||'').trim(), email=String(b.email||'').trim(), subject=String(b.subject||'').trim(), message=String(b.message||'').trim();
    if(!name||!email||!subject||!message) return json({ok:false,error:'Please complete all fields.'},400);
    if(!/^\S+@\S+\.\S+$/.test(email)) return json({ok:false,error:'Please enter a valid email address.'},400);
    await env.DB.prepare('INSERT INTO contact_messages (name,email,subject,message,created_at) VALUES (?,?,?,?,?)').bind(name,email,subject,message,new Date().toISOString()).run();
    return json({ok:true});
  } catch(e) { console.error('Contact API error:',e); return json({ok:false,error:'Message could not be sent.'},500); }
}
async function handlePublicDonation(request, env) {
  try { const b=await request.json(); const name=String(b.name||'').trim(), email=String(b.email||'').trim(), method=String(b.payment_method||'').trim(), tr=String(b.tr_id||'').trim(), amount=Number(b.final_amount);
    if(!name||!method||!tr||!Number.isFinite(amount)||amount<=0) return json({ok:false,error:'Please provide valid donation details.'},400);
    await env.DB.prepare("INSERT INTO donations (name,email,amount,payment_method,tr_id,status,created_at,message) VALUES (?,?,?,?,?,'pending',?,?)").bind(name,email,amount,method,tr,new Date().toISOString(),String(b.message||'').trim()).run();
    return json({ok:true});
  } catch(e) { const duplicate=String(e.message||'').toLowerCase().includes('unique'); return json({ok:false,error:duplicate?'This transaction ID has already been submitted.':'Donation could not be submitted.'}, duplicate?409:500); }
}

// Compatibility endpoints for existing pages. They use the same validation and
// write permissions as the modern /api/savings endpoints.
async function handleSavingAdd(request, env) {
  const [, deny] = await savingsSession(request, env, true); if (deny) return deny;
  const form = await request.formData();
  const body = Object.fromEntries(form.entries());
  const fake = new Request(request.url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const [record, error] = await savingsInput(fake, env); if (error) return error;
  const result = await env.DB.prepare('INSERT INTO sbfc_saving (date,member_id,full_name,transaction_type,amount,note,remark) VALUES (?,?,?,?,?,?,?)').bind(record.date,record.member_id,record.full_name,record.transaction_type,record.amount,record.note,record.remark).run();
  return json({ success:true, ok:true, entry_id:result.meta.last_row_id }, 201);
}
async function handleSavingDelete(request, env) {
  const [, deny] = await savingsSession(request, env, true); if (deny) return deny;
  let body; try { body=await request.json(); } catch { return json({ok:false,error:'Invalid request body.'},400); }
  const id=Number(body.id); if (!Number.isInteger(id)||id<1) return json({ok:false,error:'Invalid transaction ID.'},400);
  const result=await env.DB.prepare('DELETE FROM sbfc_saving WHERE entry_id=?').bind(id).run();
  return result.meta.changes ? json({success:true,ok:true}) : json({ok:false,error:'Transaction not found.'},404);
}

// Add these functions to the existing SBFC Worker index.js.  They use only
// sbfc_saving and sbfc_members columns in the supplied D1 schema.
const SAVINGS_TYPES = new Set(['Share','Share Return','Profit','Loan','Return Loan','Business Loan','Business Loan Return','Deposit To Bank','Withdraw From Bank','Bank Charge','Bank Profit','Cost']);
const MEMBER_SAVINGS_TYPES = new Set(['Share','Share Return','Profit','Loan','Return Loan','Business Loan','Business Loan Return']);
async function savingsSession(request, env, write=false) {
  const session=await getSession(env,request); // Reuses the Worker’s existing auth policy.
  if(!session) return [null,json({ok:false,error:'Authentication required.'},401)];
  if(write && session.role==='user') return [null,json({ok:false,error:'View-only accounts cannot change transactions.'},403)];
  await touchSession(env,session.session_id); return [session,null];
}
function savingsText(v,max=500){return String(v??'').trim().slice(0,max)}
async function savingsInput(request,env){
  let b;try{b=await request.json()}catch{return [null,json({ok:false,error:'Invalid request body.'},400)]}
  const date=savingsText(b.date,10),transaction_type=savingsText(b.transaction_type,60),amount=Number(b.amount),member_id=savingsText(b.member_id,100),full_name=savingsText(b.full_name,250),note=savingsText(b.note),remark=savingsText(b.remark);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!SAVINGS_TYPES.has(transaction_type)||!Number.isFinite(amount)||amount<=0||!full_name) return [null,json({ok:false,error:'Please provide valid transaction details.'},400)];
  if(MEMBER_SAVINGS_TYPES.has(transaction_type)) { const m=await env.DB.prepare("SELECT member_id,full_name FROM sbfc_members WHERE member_id=? AND status='active'").bind(member_id).first(); if(!m||m.full_name!==full_name) return [null,json({ok:false,error:'Select an active SBFC member.'},400)]; }
  return [{date,member_id:MEMBER_SAVINGS_TYPES.has(transaction_type)?member_id:'',full_name,transaction_type,amount,note,remark},null];
}
async function handleSavingsMembers(request,env){const[,deny]=await savingsSession(request,env);if(deny)return deny;const r=await env.DB.prepare("SELECT member_id,full_name FROM sbfc_members WHERE status='active' ORDER BY member_id").all();return json({ok:true,members:r.results||[]})}
async function handleSavingsList(request,env){const[,deny]=await savingsSession(request,env);if(deny)return deny;const u=new URL(request.url),m=savingsText(u.searchParams.get('member_id'),100),t=savingsText(u.searchParams.get('transaction_type'),60),month=savingsText(u.searchParams.get('month'),7),args=[],where=[];if(m){where.push('member_id=?');args.push(m)}if(t){if(!SAVINGS_TYPES.has(t))return json({ok:false,error:'Invalid transaction type.'},400);where.push('transaction_type=?');args.push(t)}if(month){if(!/^\d{4}-\d{2}$/.test(month))return json({ok:false,error:'Invalid month.'},400);where.push('date LIKE ?');args.push(month+'%')}const clause=where.length?' WHERE '+where.join(' AND '):'';const r=await env.DB.prepare('SELECT entry_id,date,member_id,full_name,transaction_type,amount,note,remark FROM sbfc_saving'+clause+' ORDER BY date DESC,entry_id DESC').bind(...args).all(), records=(r.results||[]).map(x=>({...x,amount:Number(x.amount)||0}));return json({ok:true,records,total:records.reduce((n,x)=>n+x.amount,0)})}
async function handleSavingsCreate(request,env){const[,deny]=await savingsSession(request,env,true);if(deny)return deny;const[b,error]=await savingsInput(request,env);if(error)return error;const r=await env.DB.prepare('INSERT INTO sbfc_saving (date,member_id,full_name,transaction_type,amount,note,remark) VALUES (?,?,?,?,?,?,?)').bind(b.date,b.member_id,b.full_name,b.transaction_type,b.amount,b.note,b.remark).run();return json({ok:true,entry_id:r.meta.last_row_id},201)}
async function handleSavingsUpdate(request,env,id){const[,deny]=await savingsSession(request,env,true);if(deny)return deny;const[b,error]=await savingsInput(request,env);if(error)return error;const r=await env.DB.prepare('UPDATE sbfc_saving SET date=?,member_id=?,full_name=?,transaction_type=?,amount=?,note=?,remark=? WHERE entry_id=?').bind(b.date,b.member_id,b.full_name,b.transaction_type,b.amount,b.note,b.remark,id).run();return r.meta.changes?json({ok:true}):json({ok:false,error:'Transaction not found.'},404)}
async function handleSavingsDelete(request,env,id){const[,deny]=await savingsSession(request,env,true);if(deny)return deny;const r=await env.DB.prepare('DELETE FROM sbfc_saving WHERE entry_id=?').bind(id).run();return r.meta.changes?json({ok:true}):json({ok:false,error:'Transaction not found.'},404)}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(request) });

    if (url.pathname === "/api/login" && request.method === "POST")
      return withCors(await handleLoginResponse(request, env), request);
    if (url.pathname === "/api/logout" && request.method === "POST")
      return withCors(await handleLogout(request, env), request);
    if (url.pathname === "/api/me" && request.method === "GET")
      return withCors(await handleMe(request, env), request);
    if (url.pathname === "/api/contact" && request.method === "POST")
      return withCors(await handlePublicContact(request, env), request);
    if (url.pathname === "/api/donations" && request.method === "POST")
      return withCors(await handlePublicDonation(request, env), request);
    if (url.pathname === "/api/savings-members" && request.method === "GET") return withCors(await handleSavingsMembers(request, env), request);
    if (url.pathname === "/api/savings" && request.method === "GET") return withCors(await handleSavingsList(request, env), request);
    if (url.pathname === "/api/savings" && request.method === "POST") return withCors(await handleSavingsCreate(request, env), request);
    const savingsMatch = url.pathname.match(/^\/api\/savings\/(\d+)$/);
    if (savingsMatch && request.method === "PUT") return withCors(await handleSavingsUpdate(request, env, Number(savingsMatch[1])), request);
    if (savingsMatch && request.method === "DELETE") return withCors(await handleSavingsDelete(request, env, Number(savingsMatch[1])), request);
    if (url.pathname === "/api/savings-report" && request.method === "GET")
      return withCors(await handleSavingsReport(request, env), request);
    if (url.pathname === "/api/savings-history" && request.method === "GET")
      return withCors(await handleSavingsHistory(request, env), request);
    if (url.pathname === "/api/saving/add" && request.method === "POST") return withCors(await handleSavingAdd(request, env), request);
    if (url.pathname === "/api/saving/delete" && request.method === "POST") return withCors(await handleSavingDelete(request, env), request);
    if (url.pathname === "/api/finance" && request.method === "GET")
      return withCors(await handleFinance(request, env), request);
    if (url.pathname === "/api/dashboard" && request.method === "GET")
      return withCors(await handleDashboard(request, env), request);
    const donationMatch = url.pathname.match(
      /^\/api\/donations\/(\d+)\/status$/,
    );
    if (donationMatch && request.method === "PATCH")
      return withCors(await handleDonationStatus(request, env, Number(donationMatch[1])), request);

    return withCors(await env.ASSETS.fetch(request), request);
  },
};
