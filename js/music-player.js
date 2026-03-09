// RetroMynd Music Player
// Persistent lo-fi player with YouTube integration

class RetroMyndPlayer {
    constructor() {
        this.playlist = [
            { id: 'jfKfPfyJRdk', title: 'lofi hip hop radio 📚 - beats to relax/study to' },
            { id: '5qap5aO4i9A', title: 'lofi hip hop radio 🎧 - beats to chill/study to' },
            { id: 'lTRiuFIWV54', title: 'synthwave radio 🌌 - beats to chill/game to' },
            { id: 'DWcJFNfaw9c', title: 'Chillhop Radio - jazzy & lofi hip hop beats' },
            { id: 'rUxyKA_-grg', title: 'jazz/lofi hip hop radio 🎷 - smooth beats' }
        ];
        
        this.currentIndex = 0;
        this.player = null;
        this.isReady = false;
        this.isPlaying = false;
        
        this.loadState();
        this.initYouTubeAPI();
        this.setupControls();
        this.setupRadioToggle();
    }
    
    initYouTubeAPI() {
        // Check if API already loaded
        if (window.YT && window.YT.Player) {
            this.onYouTubeReady();
            return;
        }
        
        // If another instance already registered the callback, chain onto it
        const existingCallback = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
            if (existingCallback) existingCallback();
            this.onYouTubeReady();
        };
        
        // Only inject the script tag once
        if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
    }
    
    onYouTubeReady() {
        const container = document.getElementById('yt-player');
        if (!container) return;
        
        // Avoid double-init if YT.Player already attached
        if (this.player) return;
        
        this.player = new YT.Player('yt-player', {
            height: '0',
            width: '0',
            videoId: this.playlist[this.currentIndex].id,
            playerVars: {
                autoplay: 0,
                controls: 0,
                disablekb: 1,
                fs: 0,
                modestbranding: 1,
                playsinline: 1
            },
            events: {
                onReady: (e) => this.onPlayerReady(e),
                onStateChange: (e) => this.onPlayerStateChange(e)
            }
        });
    }
    
    onPlayerReady(event) {
        this.isReady = true;
        this.updateDisplay();
        
        // Auto-play if was playing before
        const savedState = localStorage.getItem('rmPlayer');
        if (savedState) {
            const state = JSON.parse(savedState);
            if (state.isPlaying) {
                setTimeout(() => this.play(), 500);
            }
        }
    }
    
    onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.ENDED) {
            this.next();
        }
        
        this.isPlaying = (event.data === YT.PlayerState.PLAYING);
        this.updatePlayButton();
        this.updateRadioButtonPulse();
        this.saveState();
    }
    
    setupControls() {
        const playBtn = document.getElementById('rm-play');
        const prevBtn = document.getElementById('rm-prev');
        const nextBtn = document.getElementById('rm-next');
        
        if (playBtn) {
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.togglePlay();
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.prev();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.next();
            });
        }
        
        // Close button
        const closeBtn = document.getElementById('rm-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closePanel();
            });
        }
    }
    
    setupRadioToggle() {
        const btn = document.getElementById('rm-radio-btn');
        const panel = document.getElementById('rm-radio-panel');
        
        if (!btn || !panel) return;
        
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = panel.style.display === 'flex';
            if (isOpen) {
                this.closePanel();
            } else {
                this.openPanel();
            }
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#rm-player')) {
                this.closePanel();
            }
        });
    }
    
    openPanel() {
        const panel = document.getElementById('rm-radio-panel');
        if (!panel) return;
        // Reset animation so it plays fresh each open
        panel.style.animation = 'none';
        panel.style.display = 'flex';
        // Trigger reflow then re-apply animation
        panel.offsetHeight; // eslint-disable-line no-unused-expressions
        panel.style.animation = '';
        this.updateDisplay();
    }
    
    closePanel() {
        const panel = document.getElementById('rm-radio-panel');
        if (panel) panel.style.display = 'none';
    }
    
    togglePlay() {
        if (!this.isReady) return;
        
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        if (!this.isReady || !this.player) return;
        this.player.playVideo();
    }
    
    pause() {
        if (!this.isReady || !this.player) return;
        this.player.pauseVideo();
    }
    
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
        this.loadTrack();
    }
    
    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack();
    }
    
    loadTrack() {
        if (!this.isReady || !this.player) return;
        
        const wasPlaying = this.isPlaying;
        this.player.loadVideoById(this.playlist[this.currentIndex].id);
        
        if (wasPlaying) {
            setTimeout(() => this.play(), 300);
        }
        
        this.updateDisplay();
        this.saveState();
    }
    
    updateDisplay() {
        const titleEl = document.getElementById('rm-track-title');
        if (titleEl) {
            titleEl.textContent = this.playlist[this.currentIndex].title;
        }
        const thumbEl = document.getElementById('rm-thumbnail');
        if (thumbEl) {
            const track = this.playlist[this.currentIndex];
            thumbEl.src = `https://img.youtube.com/vi/${track.id}/mqdefault.jpg`;
            thumbEl.alt = track.title;
            thumbEl.onerror = function() { this.style.opacity = '0'; };
            thumbEl.onload = function() { this.style.opacity = '1'; };
        }
    }

    updatePlayButton() {
        const playBtn = document.getElementById('rm-play');
        if (!playBtn) return;

        if (this.isPlaying) {
            playBtn.innerHTML = '<svg class="rm-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
            playBtn.setAttribute('aria-label', 'Pausar');
        } else {
            playBtn.innerHTML = '<svg class="rm-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
            playBtn.setAttribute('aria-label', 'Tocar');
        }
    }
    
    updateRadioButtonPulse() {
        const btn = document.getElementById('rm-radio-btn');
        if (!btn) return;
        
        if (this.isPlaying) {
            btn.classList.add('playing');
        } else {
            btn.classList.remove('playing');
        }
    }
    
    saveState() {
        const state = {
            currentIndex: this.currentIndex,
            isPlaying: this.isPlaying
        };
        localStorage.setItem('rmPlayer', JSON.stringify(state));
    }
    
    loadState() {
        const savedState = localStorage.getItem('rmPlayer');
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                this.currentIndex = state.currentIndex || 0;
            } catch (e) {
                // ignore malformed state
            }
        }
    }
}

// Initialize player when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.rmPlayer = new RetroMyndPlayer();
    });
} else {
    window.rmPlayer = new RetroMyndPlayer();
}
