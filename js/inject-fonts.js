/* RetroMynd Typography Injector
   Auto-loads Source Sans 3 + Source Serif 4 + Source Code Pro
   and the typography.css override sheet */
(function(){
  // 1. Preconnect
  var pc1 = document.createElement('link');
  pc1.rel = 'preconnect'; pc1.href = 'https://fonts.googleapis.com';
  document.head.appendChild(pc1);
  var pc2 = document.createElement('link');
  pc2.rel = 'preconnect'; pc2.href = 'https://fonts.gstatic.com'; pc2.crossOrigin = '';
  document.head.appendChild(pc2);

  // 2. Google Fonts
  var gf = document.createElement('link');
  gf.rel = 'stylesheet';
  gf.href = 'https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;0,8..60,700;1,8..60,400;1,8..60,500&family=Source+Code+Pro:wght@400;500;600&display=swap';
  document.head.appendChild(gf);

  // 3. Typography override CSS
  var tc = document.createElement('link');
  tc.rel = 'stylesheet'; tc.href = '/css/typography.css';
  document.head.appendChild(tc);
})();
