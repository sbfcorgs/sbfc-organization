<?php 
if(!isset($pageTitle)) $pageTitle = "SBFC Organization";
if(!isset($pageDescription)) $pageDescription = "SBFC Organization - Empowering Communities Since 1998";
$currentPage = basename($_SERVER['PHP_SELF']);

// Force no caching
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="google-site-verification" content="w22cgRLzmWNeXv7M6ldQhxDb7-kPznji5LOnlVvTf0E" />
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?php echo htmlspecialchars($pageTitle); ?></title>
<meta name="description" content="<?php echo htmlspecialchars($pageDescription); ?>">

<!-- SEO Meta Tags -->
<meta name="keywords" content="SBFC Organization, সমাজ উন্নয়ন, Bangladesh NGO, savings, community, donation, Zahir Uddin Rasel">
<meta name="author" content="SBFC Organization">
<meta name="robots" content="index, follow">
<meta name="googlebot" content="index, follow">
<link rel="canonical" href="https://sbfcorgs.free.nf<?php echo strtok($_SERVER['REQUEST_URI'], '?'); ?>">

<!-- Open Graph (Facebook, WhatsApp preview) -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="SBFC Organization">
<meta property="og:title" content="<?php echo htmlspecialchars($pageTitle); ?>">
<meta property="og:description" content="<?php echo htmlspecialchars($pageDescription); ?>">
<meta property="og:image" content="https://sbfcorgs.free.nf/images/logo.png">
<meta property="og:url" content="https://sbfcorgs.free.nf<?php echo strtok($_SERVER['REQUEST_URI'], '?'); ?>">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="<?php echo htmlspecialchars($pageTitle); ?>">
<meta name="twitter:description" content="<?php echo htmlspecialchars($pageDescription); ?>">
<meta name="twitter:image" content="https://sbfcorgs.free.nf/images/logo.png">

<!-- Structured Data (Google Knowledge) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "SBFC Organization",
  "url": "https://sbfcorgs.free.nf",
  "logo": "https://sbfcorgs.free.nf/images/logo.png",
  "description": "SBFC Organization — Community savings and welfare organization founded in 1998.",
  "foundingDate": "1998",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "url": "https://sbfcorgs.free.nf/contact.php"
  }
}
</script>

<link rel="icon" type="image/png" href="../images/logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap"></noscript>
<link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"></noscript>
<link rel="stylesheet" href="../style.css?v=<?php echo filemtime(dirname(__DIR__).'/style.css'); ?>">

    <!-- PWA -->
    <meta name="theme-color" content="#22c55e">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="SBFC">
    
    <link rel="apple-touch-icon" href="/images/logo.png">
<style>
@keyframes qpulse{0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,.5)}60%{box-shadow:0 0 0 10px rgba(34,197,94,0)}}
@keyframes qspin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
@keyframes qbounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes qtipIn{0%{opacity:0;transform:translateX(-50%) translateY(8px) scale(.88)}100%{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}}
.quran-btn{display:inline-flex;align-items:center;justify-content:center;position:absolute;left:50%;transform:translateX(-50%);width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#15803d,#22c55e);text-decoration:none;flex-shrink:0;animation:qpulse 2.4s ease-in-out infinite;transition:transform .2s;z-index:10;}
.quran-btn:hover{transform:translateX(-50%) scale(1.12);}
.quran-btn:hover .quran-tip{opacity:1;pointer-events:auto;animation:qtipIn .18s ease forwards;}
.quran-ring{position:absolute;inset:-5px;border-radius:50%;border:1.5px dashed rgba(34,197,94,.6);animation:qspin 8s linear infinite;pointer-events:none;}
.quran-icon{font-size:20px;animation:qbounce 3s ease-in-out infinite;line-height:1;}
.quran-dot{position:absolute;top:-3px;right:-3px;width:14px;height:14px;border-radius:50%;background:#ef4444;border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:8px;color:#fff;font-weight:700;font-family:sans-serif;}
.quran-tip{position:absolute;top:calc(100% + 10px);left:50%;transform:translateX(-50%) translateY(8px);background:#14532d;color:#dcfce7;padding:6px 12px;border-radius:8px;white-space:nowrap;font-size:11px;font-weight:600;font-family:sans-serif;opacity:0;pointer-events:none;box-shadow:0 4px 16px rgba(21,128,61,.4);}
.quran-tip::before{content:'';position:absolute;bottom:100%;left:50%;transform:translateX(-50%);border:6px solid transparent;border-bottom-color:#14532d;}
@media(max-width:768px){.quran-btn{position:static;transform:none;width:38px;height:38px;margin:8px auto;}.quran-btn:hover{transform:scale(1.1);}.quran-icon{font-size:17px;}.quran-tip{display:none;}}
</style>

<?php include 'pwa.php'; ?>
</head>
<body>

<div class="site-header">
  <header class="main-header" id="mainHeader">
    <nav class="navbar" style="position:relative;">
      <div class="nav-left">
        <a href="../index.php"><img src="../images/logo.png" alt="SBFC Logo" class="logo" width="44" height="44" decoding="async"></a>
        <a href="../index.php" class="nav-brand">SBFC <span>Organization</span></a>
      </div>

      <!-- Quran Button — Navbar Center -->
      <a class="quran-btn" href="../quran.php" title="Read or Listen Quran" aria-label="Read or Listen Quran">
        <div class="quran-ring"></div>
        <span class="quran-icon">📖</span>
        <div class="quran-dot">✦</div>
        <div class="quran-tip">📖 Read or Listen Quran</div>
      </a>

            <div class="nav-links" id="navLinks">
        <a href="../index.php"    class="<?php if($currentPage=='index.php') echo 'active'; ?>">Home</a>
        <a href="../gallery.php"  class="<?php if($currentPage=='gallery.php') echo 'active'; ?>">Gallery</a>
        <a href="../history.php"  class="<?php if($currentPage=='history.php') echo 'active'; ?>">History</a>
        <a href="../founder.php"  class="<?php if($currentPage=='founder.php') echo 'active'; ?>">Founders</a>
        <a href="../contact.php"  class="<?php if($currentPage=='contact.php') echo 'active'; ?>">Contact</a>
        <a href="../about.php"    class="<?php if($currentPage=='about.php') echo 'active'; ?>">About</a>
        <a href="../give.php" class="donate-btn <?php if($currentPage=='give.php') echo 'active'; ?>"><i class="fas fa-heart"></i> Donate</a>
      </div>
      <button class="hamburger" id="hamburger" aria-label="Toggle menu">
        <i class="fas fa-bars" id="hamIcon"></i>
      </button>
    </nav>
  </header>
</div>

<script>
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const hamIcon   = document.getElementById('hamIcon');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamIcon.className = navLinks.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
});
window.addEventListener('scroll', () => {
  document.getElementById('mainHeader').classList.toggle('scrolled', window.scrollY > 60);
});

function initFadeIn() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('visible');
    } else {
      io.observe(el);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFadeIn);
} else {
  initFadeIn();
}
</script>