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
        
        this.initYouTubeAPI();
        this.setupControls();
        this.loadState();
    }
    
    initYouTubeAPI() {
        // Check if API already loaded
        if (window.YT && window.YT.Player) {
            this.onYouTubeReady();
            return;
        }
        
        // Load YouTube IFrame API
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        
        window.onYouTubeIframeAPIReady = () => this.onYouTubeReady();
    }
    
    onYouTubeReady() {
        const container = document.getElementById('yt-player');
        if (!container) return;
        
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
        this.saveState();
    }
    
    setupControls() {
        const playBtn = document.getElementById('rm-play');
        const prevBtn = document.getElementById('rm-prev');
        const nextBtn = document.getElementById('rm-next');
        
        if (playBtn) {
            playBtn.addEventListener('click', () => this.togglePlay());
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prev());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.next());
        }
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
    }
    
    updatePlayButton() {
        const playBtn = document.getElementById('rm-play');
        if (!playBtn) return;
        
        if (this.isPlaying) {
            playBtn.textContent = '⏸';
            playBtn.setAttribute('aria-label', 'Pausar');
        } else {
            playBtn.textContent = '▶';
            playBtn.setAttribute('aria-label', 'Tocar');
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
            const state = JSON.parse(savedState);
            this.currentIndex = state.currentIndex || 0;
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
