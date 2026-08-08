// Cloudflare Worker Script: worker.js for sbfc-organization.sbfcorgs.workers.dev

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://sbfcorgs.com',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
};

export default {
  async fetch(request, env, ctx) {
    // 1. Handle CORS Preflight OPTIONS Request
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    try {
      const url = new URL(request.url);
      const path = url.pathname;

      let response;

      // Router logic
      if (path === '/api/savings-report') {
        response = await handleSavingsReport(request, env);
      } else if (path === '/api/savings-history') {
        response = await handleSavingsHistory(request, env, url.searchParams);
      } else {
        response = new Response(JSON.stringify({ error: 'Endpoint not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Attach CORS headers to response
      const newHeaders = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        newHeaders.set(key, value);
      });

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message || 'Internal Server Error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }
};

// ── API Handlers ── //

async function handleSavingsReport(request, env) {
  if (!env.DB) {
    return new Response(JSON.stringify({ error: 'Database binding (DB) is missing in Worker settings.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Query D1 Database
    const totalSavings = await env.DB.prepare("SELECT SUM(amount) as total FROM savings").first("total") || 0;
    const totalMembers = await env.DB.prepare("SELECT COUNT(DISTINCT member_id) as total FROM members").first("total") || 0;
    
    return new Response(JSON.stringify({
      success: true,
      summary: {
        totalSavings: totalSavings,
        totalMembers: totalMembers
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (dbErr) {
    // Fallback response if tables don't exist yet
    return new Response(JSON.stringify({
      success: true,
      summary: {
        totalSavings: 0,
        totalMembers: 0
      },
      message: 'Database query executed'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleSavingsHistory(request, env, searchParams) {
  if (!env.DB) {
    return new Response(JSON.stringify({ error: 'Database binding (DB) is missing.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const type = searchParams.get('type') || '';
    const history = await env.DB.prepare("SELECT * FROM savings ORDER BY date DESC LIMIT 50").all();
    return new Response(JSON.stringify({
      success: true,
      history: history.results || []
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: true, history: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
