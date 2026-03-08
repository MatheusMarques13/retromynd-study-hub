// RetroMynd Music Player Injector
// Load this script to automatically inject the music player into any page

(function() {
    // Only inject once
    if (document.getElementById('rm-player')) {
        return;
    }
    
    // Fetch and inject player HTML
    fetch('/music-player.html')
        .then(function(response) { return response.text(); })
        .then(function(html) {
            // Parse fetched HTML into a temporary container
            const container = document.createElement('div');
            container.innerHTML = html;

            // Inject the <style> block (if any) into <head>
            const styleEl = container.querySelector('style');
            if (styleEl) {
                document.head.appendChild(styleEl.cloneNode(true));
            }

            // Inject the #rm-player element
            const playerEl = container.querySelector('#rm-player');
            if (playerEl) {
                document.body.appendChild(playerEl);
            }

            // Inject the #yt-player div (hidden YouTube container)
            const ytEl = container.querySelector('#yt-player');
            if (ytEl) {
                if (!document.getElementById('yt-player')) {
                    document.body.appendChild(ytEl);
                }
            } else if (!document.getElementById('yt-player')) {
                // Fallback: create it manually
                const ytDiv = document.createElement('div');
                ytDiv.id = 'yt-player';
                ytDiv.style.display = 'none';
                ytDiv.style.position = 'absolute';
                ytDiv.style.width = '0';
                ytDiv.style.height = '0';
                ytDiv.style.overflow = 'hidden';
                document.body.appendChild(ytDiv);
            }

            // Load music-player.js to initialize
            const script = document.createElement('script');
            script.src = '/js/music-player.js';
            document.body.appendChild(script);

            console.log('RetroMynd Radio loaded!');
        })
        .catch(function(error) {
            console.error('Failed to load music player:', error);
        });
})();
