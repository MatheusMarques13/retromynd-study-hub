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
            // Insert the player widget (first element)
            const playerEl = container.querySelector('#rm-player');
            if (playerEl) document.body.appendChild(playerEl);
            // Also ensure the hidden yt-player div exists
            if (!document.getElementById('yt-player')) {
                const ytDiv = document.createElement('div');
                ytDiv.id = 'yt-player';
                ytDiv.style.display = 'none';
                document.body.appendChild(ytDiv);
            }
            // Load music-player.js to initialize
            const script = document.createElement('script');
            script.src = '/js/music-player.js';
            document.body.appendChild(script);
            console.log('🎵 RetroMynd Music Player loaded!');
        })
        .catch(error => {
            console.error('Failed to load music player:', error);
        });
})();
