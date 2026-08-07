<?php
header('Content-Type: application/manifest+json');
header('Cache-Control: no-cache');
echo '{
  "name": "SBFC Organization",
  "short_name": "SBFC",
  "description": "Empowering Communities, Changing Lives since 1998",
  "start_url": "/index.php",
  "display": "standalone",
  "background_color": "#0d1f17",
  "theme_color": "#22c55e",
  "icons": [
    {"src": "/images/logo.png", "sizes": "192x192", "type": "image/png"},
    {"src": "/images/logo.png", "sizes": "512x512", "type": "image/png"}
  ]
}';
?>
