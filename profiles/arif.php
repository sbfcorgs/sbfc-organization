<?php
require '../db.php';
$pageTitle = "Md Arif Hossain | Founder | SBFC Organization";
$pageDescription = "Profile of Md Arif Hossain – Founder of SBFC Organization.";
include 'header.php';
?>
<style>
.zr-hero{min-height:25vh;padding-top:100px;padding-bottom:25px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;background:linear-gradient(150deg,#0d1f17,#12381f);text-align:center;position:relative;overflow:hidden;}
.zr-hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 60% at 50% 0%,rgba(56,189,112,.12),transparent);pointer-events:none;}
.zr-hero-avatar{width:160px;height:160px;border-radius:50%;object-fit:cover;border:4px solid var(--accent);margin:0 auto 28px;display:block;box-shadow:0 0 0 8px rgba(56,189,112,.15);}
.zr-avatar-placeholder{width:160px;height:160px;border-radius:50%;background:rgba(56,189,112,.12);border:4px solid var(--accent);margin:0 auto 28px;display:flex;align-items:center;justify-content:center;font-size:52px;font-weight:800;color:var(--accent);box-shadow:0 0 0 8px rgba(56,189,112,.15);}
.zr-hero-name{font-size:clamp(36px,5vw,64px);font-weight:800;color:var(--white);margin-bottom:12px;line-height:1.1;}
.zr-hero-name em{color:var(--accent);font-style:normal;}
.zr-hero-role{display:inline-block;background:rgba(56,189,112,.18);border:1px solid rgba(56,189,112,.35);color:var(--accent);font-size:18px;font-weight:600;padding:8px 28px;border-radius:999px;margin-bottom:24px;letter-spacing:.03em;}
.zr-hero-sub{font-size:19px;color:rgba(255,255,255,.65);max-width:600px;margin:0 auto 36px;line-height:1.7;}
.zr-hero-tags{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;max-width:700px;margin:0 auto;}
.zr-tag{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.15);color:rgba(255,255,255,.85);font-size:15px;padding:6px 18px;border-radius:999px;}
.zr-body{background:#0f1a13;padding:80px 20px;}
.zr-container{max-width:1000px;margin:0 auto;display:grid;grid-template-columns:1fr 2fr;gap:36px;align-items:start;}
@media(max-width:760px){.zr-container{grid-template-columns:1fr;}}
.zr-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);border-radius:20px;padding:36px 32px;margin-bottom:28px;}
.zr-card-label{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--accent);margin-bottom:22px;}
.zr-card h2{font-size:30px;font-weight:700;color:var(--white);margin-bottom:16px;line-height:1.3;}
.zr-card p{font-size:17px;color:rgba(255,255,255,.65);line-height:1.85;margin-bottom:14px;}
.zr-card p:last-child{margin-bottom:0;}
.zr-info-row{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.07);font-size:16px;}
.zr-info-row:last-child{border-bottom:none;}
.zr-info-label{color:rgba(255,255,255,.45);}
.zr-info-value{color:var(--white);font-weight:500;}
.zr-notice{background:rgba(56,189,112,.07);border:1px dashed rgba(56,189,112,.3);border-radius:14px;padding:28px;text-align:center;color:rgba(255,255,255,.5);font-size:16px;line-height:1.7;margin-bottom:28px;}
.zr-notice strong{color:var(--accent);display:block;font-size:18px;margin-bottom:8px;}
.zr-cta{background:linear-gradient(135deg,#0d1f17,#12381f);border-top:1px solid rgba(56,189,112,.15);text-align:center;padding:80px 20px;}
.zr-cta h2{font-size:clamp(28px,4vw,48px);font-weight:800;color:var(--white);margin-bottom:16px;}
.zr-cta p{font-size:19px;color:rgba(255,255,255,.6);margin-bottom:36px;max-width:500px;margin-left:auto;margin-right:auto;}
</style>
<div class="page-wrapper">
  <section class="zr-hero">
    <img src="../images/founder3.jpg" alt="Md Arif Hossain" class="zr-hero-avatar"
      onerror="this.style.display='none';document.getElementById('arif-placeholder').style.display='flex';">
    <div id="arif-placeholder" class="zr-avatar-placeholder" style="display:none;">AH</div>
    <h1 class="zr-hero-name">Md Arif <em>Hossain</em></h1>
    <div class="zr-hero-role">Founder — SBFC Organization</div>
    <p class="zr-hero-sub">Working tirelessly towards sustainable community impact and long-term growth.</p>
    <div class="zr-hero-tags">
      <span class="zr-tag">Sustainable Impact</span>
      <span class="zr-tag">Community Growth</span>
      <span class="zr-tag">Social Change</span>
      <span class="zr-tag">Long-term Vision</span>
    </div>
  </section>
  <div class="zr-body">
    <div class="zr-container">
      <div>
        <div class="zr-card">
          <div class="zr-card-label">Basic Info</div>
          <div class="zr-info-row"><span class="zr-info-label">Role</span><span class="zr-info-value">Founder</span></div>
          <div class="zr-info-row"><span class="zr-info-label">Organization</span><span class="zr-info-value">SBFC Organization</span></div>
          <div class="zr-info-row"><span class="zr-info-label">Nationality</span><span class="zr-info-value">Bangladeshi</span></div>
          <div class="zr-info-row"><span class="zr-info-label">Date of Birth</span><span class="zr-info-value">30 December 1986</span></div>
          <div class="zr-info-row"><span class="zr-info-label">Marital Status</span><span class="zr-info-value">Married</span></div>
          <div class="zr-info-row"><span class="zr-info-label">Spouse</span><span class="zr-info-value"><a href="../family/soniya_arif.php" style="color:var(--accent);text-decoration:none;font-weight:600;">Soniya Akter ↗</a></span></div>
          <div class="zr-info-row"><span class="zr-info-label">Children </span><span class="zr-info-value">Girl-1, Boy-1</span></div>
          <div class="zr-info-row"><span class="zr-info-label">Children</span><span class="zr-info-value"><a href="../family/ayat.php" style="color:var(--accent);text-decoration:none;">Ayat ↗</a> &nbsp;/&nbsp; <a href="../family/abrar.php" style="color:var(--accent);text-decoration:none;">Abrar Hossain Araf ↗</a></span></div>
          <div class="zr-info-row"><span class="zr-info-label">Location </span><span class="zr-info-value">Dhaka, Bangladesh</span></div>
        </div>
      </div>
      <div>
        <div class="zr-card">
          <div class="zr-card-label">About</div>
          <h2>Founder &amp; Impact Builder</h2>
          <p>Md Arif Hossain is one of the founding pillars of SBFC Organization. His relentless dedication to community welfare and sustainable growth has been instrumental in shaping the organization's long-term vision.</p>
          <p>He brings a thoughtful, strategic approach to every initiative — ensuring that SBFC's work creates real, lasting change in the lives of the people it serves.</p>
        </div>
        <div class="zr-notice">
          <strong>Full Profile Coming Soon</strong>
          Detailed information about Md Arif Hossain will be added shortly. Check back soon to learn more about his journey and contributions.
        </div>
      </div>
    </div>
  </div>
  <div class="zr-cta">
    <h2>Join the Movement</h2>
    <p>Support the mission our founders built — empowering communities across the UAE and beyond.</p>
    <a href="../give.php" class="btn-white"><i class="fas fa-heart"></i> Donate Now</a>
    &nbsp;&nbsp;
    <a href="../founder.php" class="btn-white" style="background:transparent;border:1px solid rgba(255,255,255,.2);color:rgba(255,255,255,.75);"><i class="fas fa-arrow-left"></i> Back to Founders</a>
  </div>
</div>
<?php include 'footer.php'; ?>
