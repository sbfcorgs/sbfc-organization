<?php
require '../db.php';
$pageTitle = "Soniya Akter | SBFC Organization Family";
include '../profiles/header.php';
?>
<style>
.zr-info-row{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.07);font-size:15px;}
.zr-info-row:last-child{border-bottom:none;}
.zr-info-label{color:rgba(255,255,255,.45);}
.zr-info-value{color:var(--white);font-weight:500;}
</style>
<section class="page-hero" style="min-height:25vh!important;">
  <div class="section-tag">Family Member</div>
  <h1 class="section-heading" style="color:var(--white);">Soniya Akter</h1>
  <p style="color:var(--accent);font-size:16px;margin-top:8px;">Spouse of Md Arif Hossain</p>
</section>
<section>
  <div style="max-width:600px;margin:0 auto;">
    <div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:16px;padding:32px;">
      <div style="display:flex;flex-direction:column;gap:0;">
        <div class="zr-info-row"><span class="zr-info-label">Full Name</span><span class="zr-info-value">Soniya Akter</span></div>
        <div class="zr-info-row"><span class="zr-info-label">Relation</span><span class="zr-info-value">Spouse of Md Arif Hossain</span></div>
        <div class="zr-info-row"><span class="zr-info-label">Date of Birth</span><span class="zr-info-value">Edit Birthday</span></div>
        <div class="zr-info-row"><span class="zr-info-label">Nationality</span><span class="zr-info-value">Bangladeshi</span></div>
        <div class="zr-info-row"><span class="zr-info-label">Religion</span><span class="zr-info-value">Islam</span></div>
        <div class="zr-info-row"><span class="zr-info-label">Location</span><span class="zr-info-value">Dhaka, Bangladesh</span></div>
      </div>
      <div style="margin-top:28px;text-align:center;">
        <a href="../profiles/arif.php" style="display:inline-flex;align-items:center;gap:8px;background:rgba(245,166,35,0.12);border:1px solid rgba(245,166,35,0.3);color:var(--accent);padding:10px 24px;border-radius:50px;text-decoration:none;font-weight:600;font-size:14px;">
          &#8592; View Md Arif Hossain's Profile
        </a>
      </div>
    </div>
  </div>
</section>
<?php include '../profiles/footer.php'; ?>
