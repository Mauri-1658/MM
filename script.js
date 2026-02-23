// ========================================
// ROMANTIC WEBPAGE — SCRIPT
// ========================================

// --- YOUTUBE PLAYER (Global for YT API callback) ---
let ytPlayer = null;
let isPlaying = false;
let playerReady = false;
let pendingPlay = false; // true si el user hizo click antes de que YT cargase

// Lista de canciones (añade o cambia IDs aquí)
const playlist = [
    '9fCiUt9Z60Q',  // Canción 1 — Dícelo (Jay Wheeler)
    'yvcA6yGC1XE',  // Canción 2 — En la otra vida (Funzo)
    '5AKWzn04BuU'   // Canción 3 — Playa Privada (Mora)
];
const startTimes = [0, 15, 0]; // segundo donde empieza cada canción
const songNames = [
    'Dícelo — Jay Wheeler',
    'En la otra vida — Funzo',
    'Playa Privada — Mora'
];
let currentSongIndex = 0;

function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('yt-player', {
        height: '1',
        width: '1',
        videoId: playlist[0],
        playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            rel: 0
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    playerReady = true;
    ytPlayer.setVolume(5);

    // Si el user ya hizo click antes de que cargase, reproducir ahora
    if (pendingPlay) {
        pendingPlay = false;
        ytPlayer.playVideo();
        isPlaying = true;
        const toggle = document.getElementById('music-toggle');
        if (toggle) toggle.classList.add('playing');
        const songLabel = document.getElementById('song-name');
        if (songLabel) songLabel.textContent = songNames[currentSongIndex];
    }
}

function onPlayerStateChange(event) {
    // Cuando termina una canción, pasar a la siguiente
    if (event.data === YT.PlayerState.ENDED) {
        currentSongIndex++;
        // Si se acabaron las canciones, volver a la primera
        if (currentSongIndex >= playlist.length) {
            currentSongIndex = 0;
        }
        ytPlayer.loadVideoById({videoId: playlist[currentSongIndex], startSeconds: startTimes[currentSongIndex]});
        const songLabel = document.getElementById('song-name');
        if (songLabel) songLabel.textContent = songNames[currentSongIndex];
    }
}

// --- MAIN ---
document.addEventListener('DOMContentLoaded', () => {

    // Si la API de YouTube ya está cargada (recarga con F5), inicializar manualmente
    if (window.YT && window.YT.Player && !ytPlayer) {
        onYouTubeIframeAPIReady();
    }

    // --- PARTICLES BACKGROUND ---
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (6 + Math.random() * 6) + 's';
        particle.style.width = (2 + Math.random() * 3) + 'px';
        particle.style.height = particle.style.width;
        particlesContainer.appendChild(particle);
    }

    // --- SCROLL PROGRESS BAR ---
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    // --- INTRO SCREEN & MUSIC ---
    const introScreen = document.getElementById('intro-screen');
    const enterBtn = document.getElementById('enter-btn');
    const mainContent = document.getElementById('main-content');
    const musicToggle = document.getElementById('music-toggle');
    const musicPlayer = document.getElementById('music-player');

    enterBtn.addEventListener('click', () => {
        // Fade out intro
        introScreen.classList.add('fade-out');

        // Show main content
        setTimeout(() => {
            introScreen.style.display = 'none';
            mainContent.classList.remove('hidden');
            musicPlayer.classList.add('visible');

            // Play YouTube video (audio)
            if (playerReady && ytPlayer) {
                ytPlayer.playVideo();
                isPlaying = true;
                musicToggle.classList.add('playing');
                const songLabel = document.getElementById('song-name');
                if (songLabel) songLabel.textContent = songNames[currentSongIndex];
            } else {
                // El player aún no está listo, marcar como pendiente
                pendingPlay = true;
            }

            // Trigger first section animation
            checkVisibility();
        }, 800);
    });

    // --- MUSIC TOGGLE ---
    musicToggle.addEventListener('click', () => {
        if (!ytPlayer) return;

        if (isPlaying) {
            ytPlayer.pauseVideo();
            isPlaying = false;
            musicToggle.classList.remove('playing');
        } else {
            ytPlayer.playVideo();
            isPlaying = true;
            musicToggle.classList.add('playing');
        }
    });

    // --- SKIP SONG (Click en el nombre para saltar) ---
    const songNameLabel = document.getElementById('song-name');
    if (songNameLabel) {
        songNameLabel.style.cursor = 'pointer';
        songNameLabel.title = 'Click para saltar canción (Pruebas)';
        songNameLabel.addEventListener('click', () => {
            if (ytPlayer && playerReady) {
                // Forzamos el estado ENDED para que pase a la siguiente
                onPlayerStateChange({ data: YT.PlayerState.ENDED });
            }
        });
    }
    // --- CONTADOR DE DÍAS DESDE EL 22 DE MARZO 2025 ---
    const fechaInicio = new Date(2025, 2, 22); // Marzo = 2 (0-indexed)
    const hoy = new Date();
    const diasPasados = Math.floor((hoy - fechaInicio) / (1000 * 60 * 60 * 24));

    const loadingTime = document.getElementById('loading-time');
    const daysCode = document.getElementById('days-code');
    if (loadingTime) loadingTime.textContent = diasPasados + ' días';
    if (daysCode) daysCode.textContent = diasPasados;

    // --- SCROLL ANIMATIONS ---
    function checkVisibility() {
        const sections = document.querySelectorAll('.section-inner');
        const windowHeight = window.innerHeight;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const trigger = windowHeight * 0.8;

            if (rect.top < trigger) {
                section.classList.add('visible');

                // Animate loading bar if in loading section
                const loadingFill = section.querySelector('.loading-fill');
                if (loadingFill && !loadingFill.classList.contains('animate')) {
                    setTimeout(() => loadingFill.classList.add('animate'), 500);
                }

                // Animate credits
                const credits = section.querySelectorAll('.credits-line');
                credits.forEach((credit, i) => {
                    setTimeout(() => credit.classList.add('visible'), 300 * (i + 1));
                });
            }
        });

        // Update scroll progress
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = progress + '%';
    }

    window.addEventListener('scroll', checkVisibility);
    window.addEventListener('resize', checkVisibility);

    // --- KEYBOARD SHORTCUT ---
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && e.target === document.body) {
            e.preventDefault();
            musicToggle.click();
        }
    });

});
