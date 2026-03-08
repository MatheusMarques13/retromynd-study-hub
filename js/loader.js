// LOADER - Auth guard + load all scripts
(function(){
  // Se não está logado, redireciona pro login
  const token = localStorage.getItem('token');
  if(!token){
    window.location.href = '/login.html';
    return;
  }

  // Load wood background CSS
  const woodCSS = document.createElement('link');
  woodCSS.rel = 'stylesheet';
  woodCSS.href = '/css/wood-bg.css';
  document.head.appendChild(woodCSS);

  // Carregar scripts
  const scripts = ['js/api.js','js/auth.js','js/retro-mode.js','js/midnight-mode.js','js/main.js','js/emoji-manager.js'];
  function loadScript(src){
    return new Promise((resolve)=>{
      const s=document.createElement('script');
      s.src=src; s.onload=resolve; s.onerror=()=>{console.warn('Failed:',src);resolve();};
      document.body.appendChild(s);
    });
  }
  async function loadAll(){
    for(const src of scripts) await loadScript(src);
    console.log('[RetroMynd] Scripts loaded');
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',loadAll);
  else loadAll();
})();
