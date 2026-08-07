<?php
require '../db.php';
$pageTitle = "Sumaiya Akter | SBFC Organization";
include '../profiles/header.php';
?>
<style>
.fm-hero{min-height:25vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:100px 6% 30px;background:linear-gradient(150deg,#0d1f17,#12381f);position:relative;overflow:hidden;}
.fm-hero::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,rgba(245,166,35,0.06),transparent 60%);pointer-events:none;}
.fm-avatar{width:120px;height:120px;border-radius:50%;object-fit:cover;border:3px solid var(--accent);box-shadow:0 0 0 6px rgba(245,166,35,0.15);margin-bottom:16px;}
.fm-name{font-family:var(--ff-head);font-size:clamp(24px,4vw,40px);font-weight:800;color:var(--white);margin-bottom:8px;}
.fm-role{display:inline-block;background:rgba(245,166,35,0.12);border:1px solid rgba(245,166,35,0.3);color:var(--accent);font-size:14px;font-weight:600;padding:6px 20px;border-radius:30px;}
.info-row{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.07);font-size:15px;}
.info-row:last-child{border-bottom:none;}
.info-label{color:rgba(255,255,255,.45);}
.info-value{color:var(--white);font-weight:500;}
</style>

<section class="fm-hero">
  <img src="images/sumaiya.jpg" alt="Sumaiya Akter" class="fm-avatar"
    onerror="this.src='images/default_avatar.svg'">
  <div class="fm-name">Sumaiya Akter</div>
  <div class="fm-role">Daughter of Md Mashud Rana</div>
</section>

<section>
  <div style="max-width:600px;margin:0 auto;">
    <div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:16px;padding:32px;">
      <div class="info-row"><span class="info-label">Full Name</span><span class="info-value">Sumaiya Akter</span></div>
      <div class="info-row"><span class="info-label">Relation</span><span class="info-value">Daughter of Md Mashud Rana</span></div>
      <div class="info-row"><span class="info-label">Date of Birth</span><span class="info-value">Edit Birthday</span></div>
      <div class="info-row"><span class="info-label">Nationality</span><span class="info-value">Bangladeshi</span></div>
      <div class="info-row"><span class="info-label">Religion</span><span class="info-value">Islam</span></div>
      <div class="info-row"><span class="info-label">Location</span><span class="info-value">KSA</span></div>
      
    </div>
    <div style="margin-top:24px;text-align:center;">
      <a href="../profiles/rana.php" style="display:inline-flex;align-items:center;gap:8px;background:rgba(245,166,35,0.12);border:1px solid rgba(245,166,35,0.3);color:var(--accent);padding:10px 24px;border-radius:50px;text-decoration:none;font-weight:600;font-size:14px;">
        &#8592; View Md Mashud Rana's Profile
      </a>
    </div>
  </div>
</section>
<?php include '../profiles/footer.php'; ?>
