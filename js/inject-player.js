// RetroMynd Music Player Injector
// Load this script to automatically inject the music player into any page

(function() {
    // Only inject once
    if (document.getElementById('rm-player')) {
        return;
    }
    
    // Fetch and inject player HTML
    fetch('/music-player.html')
        .then(response => response.text())
        .then(html => {
            // Create container and insert HTML
            const container = document.createElement('div');
            container.innerHTML = html;
            document.body.appendChild(container.firstElementChild);
            
            // Player script will auto-initialize via music-player.js
            console.log('🎵 RetroMynd Music Player loaded!');
        })
        .catch(error => {
            console.error('Failed to load music player:', error);
        });
})();
