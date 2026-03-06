// Auth Guard — runs BEFORE anything else
// Redirects to /login.html if user has no valid session
(function(){
  // Skip if we're already on login page
  if(window.location.pathname.includes('login')) return;

  // Check for auth token
  var token = localStorage.getItem('token');
  var session = localStorage.getItem('sb-session') || localStorage.getItem('supabase.auth.token');

  if(!token && !session){
    // No auth found — redirect to login
    window.location.replace('/login.html');
    // Stop page rendering
    document.documentElement.style.display = 'none';
  }
})();
