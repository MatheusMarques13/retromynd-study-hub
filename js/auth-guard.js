// Auth Guard — runs BEFORE anything else
// Redirects to /landing.html if user has no valid session
(function(){
  // Skip if we're already on login or landing page
  if(window.location.pathname.includes('login')) return;
  if(window.location.pathname.includes('landing')) return;

  // Check for auth token
  var token = localStorage.getItem('token');
  var session = localStorage.getItem('sb-session') || localStorage.getItem('supabase.auth.token');

  if(!token && !session){
    // No auth found — redirect to landing
    window.location.replace('/landing.html');
    // Stop page rendering
    document.documentElement.style.display = 'none';
  }
})();
