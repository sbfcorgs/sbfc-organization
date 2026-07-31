(function() {
  function injectBanner() {
    var hero = document.querySelector('.home-hero') || document.querySelector('.sbfc-hero');
    if (!hero) return;

    // Remove any existing banner
    var old = document.getElementById('sbfc-emotional-banner');
    if (old) old.remove();

    // Force hero layout
    hero.style.setProperty('display', 'grid', 'important');
    hero.style.setProperty('grid-template-columns', '1fr 1.4fr', 'important');
    hero.style.setProperty('gap', '40px', 'important');
    hero.style.setProperty('align-items', 'center', 'important');

    // Create banner
    var wrap = document.createElement('div');
    wrap.id = 'sbfc-emotional-banner';
    wrap.innerHTML = [
      '<div style="background:#0a1a0f;border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:42px 36px 34px;text-align:center;position:relative;overflow:hidden;">',
      '<div style="position:absolute;top:0;left:10%;right:10%;height:2px;background:linear-gradient(90deg,transparent,#dc5050,#ff7878,#dc5050,transparent);"></div>',
      '<div style="font-family:Georgia,serif;font-size:56px;line-height:0.6;color:rgba(220,80,80,0.18);margin-bottom:16px;">\u201c</div>',
      '<p style="font-size:15px;color:rgba(255,255,255,0.72);line-height:1.9;margin:0 0 12px;">\u09b0\u09be\u09a4 \u09e9\u099f\u09be\u09af\u09bc \u098f\u0995\u099f\u09bf \u09ae\u09be<br>\u09a4\u09be\u09b0 \u0985\u09b8\u09c1\u09b8\u09cd\u09a5 \u09b8\u09a8\u09cd\u09a4\u09be\u09a8\u0995\u09c7 \u0995\u09cb\u09b2\u09c7 \u09a8\u09bf\u09af\u09bc\u09c7<br>\u0995\u09be\u0981\u09a6\u099b\u09bf\u09b2\u09c7\u09a8 \u2014</p>',
      '<p style="font-family:Georgia,serif;font-size:22px;color:#f0f0f0;font-weight:700;margin:0 0 20px;">\u099a\u09bf\u0995\u09bf\u09ce\u09b8\u09be\u09b0 \u099f\u09be\u0995\u09be \u09a8\u09c7\u0987\u0964</p>',
      '<div style="display:flex;align-items:center;gap:10px;margin:0 0 20px;">',
      '<div style="flex:1;height:1px;background:rgba(255,255,255,0.1);"></div>',
      '<span style="color:#e05050;font-size:18px;">\u2665</span>',
      '<div style="flex:1;height:1px;background:rgba(255,255,255,0.1);"></div>',
      '</div>',
      '<p style="font-size:15px;color:rgba(255,255,255,0.82);line-height:1.8;margin:0 0 8px;">\u0986\u09aa\u09a8\u09be\u09a6\u09c7\u09b0 <strong style="color:#f5a623;">\u09ae\u09be\u09a4\u09cd\u09b0 \u09ec\u09e6\u09e6\u09e6 \u099f\u09be\u0995\u09be</strong><br>\u09b8\u09c7\u09a6\u09bf\u09a8 \u09b8\u09c7\u0987 \u09b6\u09bf\u09b6\u09c1\u09b0 \u099c\u09c0\u09ac\u09a8 \u09ac\u09be\u0981\u099a\u09bf\u09af\u09bc\u09c7\u099b\u09bf\u09b2\u0964</p>',
      '<p style="font-size:12px;color:rgba(255,255,255,0.28);font-style:italic;margin:0 0 24px;">One small act of kindness. One life saved forever.</p>',
      '<a href="give.php" style="display:inline-block;background:#c0392b;color:#fff;font-size:14px;font-weight:700;padding:13px 32px;border-radius:50px;text-decoration:none;margin-bottom:24px;">\u2665 \u0986\u099c\u0987 \u09aa\u09be\u09b6\u09c7 \u09a6\u09be\u0981\u09dc\u09be\u09a8</a>',
      '<div style="display:flex;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:12px;overflow:hidden;">',
      '<div style="flex:1;padding:12px 8px;text-align:center;"><div style="font-size:17px;font-weight:700;color:#f5a623;">5000+</div><div style="font-size:9px;color:rgba(255,255,255,0.35);margin-top:2px;">\u09aa\u09b0\u09bf\u09ac\u09be\u09b0 \u0989\u09aa\u0995\u09c3\u09a4</div></div>',
      '<div style="width:1px;background:rgba(255,255,255,0.1);"></div>',
      '<div style="flex:1;padding:12px 8px;text-align:center;"><div style="font-size:17px;font-weight:700;color:#f5a623;">26</div><div style="font-size:9px;color:rgba(255,255,255,0.35);margin-top:2px;">\u09ac\u099b\u09b0\u09c7\u09b0 \u09b8\u09c7\u09ac\u09be</div></div>',
      '<div style="width:1px;background:rgba(255,255,255,0.1);"></div>',
      '<div style="flex:1;padding:12px 8px;text-align:center;"><div style="font-size:17px;font-weight:700;color:#f5a623;">87%</div><div style="font-size:9px;color:rgba(255,255,255,0.35);margin-top:2px;">\u09b8\u09b0\u09be\u09b8\u09b0\u09bf \u09b8\u09be\u09b9\u09be\u09af\u09cd\u09af</div></div>',
      '</div></div>'
    ].join('');

    hero.appendChild(wrap);
  }

  // Run immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectBanner);
  } else {
    injectBanner();
  }

  // Run after window load (catches InfinityFree injection)
  window.addEventListener('load', function() {
    injectBanner();
    // Run again after 500ms to catch any delayed scripts
    setTimeout(injectBanner, 500);
    setTimeout(injectBanner, 1500);
  });
})();
