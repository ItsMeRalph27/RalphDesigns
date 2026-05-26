// --- 1. Algorithmic Generative Doodle Art Interactive Grid Canvas Engine ---
const canvas = document.getElementById('doodleCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Vector Matrix Array maps persistent abstract line geometries
let doodleArtPaths = [];
const pathTotalCount = 28;

class AbstractDoodlePath {
    constructor() {
        this.resetDoodleStructure();
    }
    resetDoodleStructure() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.type = Math.floor(Math.random() * 4); // 0: Geometric Grid Circle, 1: Technical Cross, 2: Chevron Grid, 3: Concentric Box
        this.size = Math.random() * 80 + 40;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
        this.rotation = Math.random() * Math.PI;
        this.rotVelocity = Math.random() * 0.01 - 0.005;
    }
    updateMovement() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotVelocity;

        // Infinite Wrap layout bounds logic 
        if (this.x < -this.size) this.x = width + this.size;
        if (this.x > width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = height + this.size;
        if (this.y > height + this.size) this.y = -this.size;
    }
    drawDoodle(doodleInkColor, accentColor) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.strokeStyle = doodleInkColor;
        ctx.lineWidth = 1.5;

        switch (this.type) {
            case 0: 
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                ctx.stroke();
                ctx.strokeStyle = accentColor;
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 4, 0, Math.PI);
                ctx.stroke();
                break;
            case 1: 
                ctx.beginPath();
                ctx.moveTo(-this.size / 2, 0); ctx.lineTo(this.size / 2, 0);
                ctx.moveTo(0, -this.size / 2); ctx.lineTo(0, this.size / 2);
                ctx.stroke();
                break;
            case 2: 
                ctx.beginPath();
                ctx.moveTo(-this.size / 3, -this.size / 3);
                ctx.lineTo(0, 0);
                ctx.lineTo(this.size / 3, -this.size / 3);
                ctx.moveTo(-this.size / 3, 0);
                ctx.lineTo(0, this.size / 3);
                ctx.lineTo(this.size / 3, 0);
                ctx.stroke();
                break;
            case 3: 
                ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);
                ctx.strokeStyle = accentColor;
                ctx.strokeRect(-this.size / 4, -this.size / 4, this.size / 2, this.size / 2);
                break;
        }
        ctx.restore();
    }
}

function initDoodleCanvasMatrix() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    doodleArtPaths = [];
    for (let i = 0; i < pathTotalCount; i++) {
        doodleArtPaths.push(new AbstractDoodlePath());
    }
}

function animateDoodleArtLayers() {
    const liveComputedStyles = getComputedStyle(document.body);
    const doodleInkColor = liveComputedStyles.getPropertyValue('--doodle-ink').trim();
    const accentColor = liveComputedStyles.getPropertyValue('--doodle-accent').trim();
    const bgBaseColor = liveComputedStyles.getPropertyValue('--bg').trim();

    ctx.fillStyle = bgBaseColor;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = document.body.classList.contains('light-theme') ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.015)';
    ctx.lineWidth = 1;
    const gridSpacing = 60;
    for (let x = 0; x < width; x += gridSpacing) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSpacing) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    doodleArtPaths.forEach(doodleItem => {
        doodleItem.updateMovement();
        doodleItem.drawDoodle(doodleInkColor, accentColor);
    });

    requestAnimationFrame(animateDoodleArtLayers);
}

window.addEventListener('resize', initDoodleCanvasMatrix);
initDoodleCanvasMatrix();
animateDoodleArtLayers();

// --- 2. Dynamic LocalStorage Theme System Controller ---
const themeToggleBtn = document.getElementById('theme-toggle');
const modeIcon = themeToggleBtn.querySelector('.mode-icon');

const savedThematicState = localStorage.getItem('theme') || 'dark-theme';
document.body.className = savedThematicState;
syncThemeToggleIconVisuals(savedThematicState);

themeToggleBtn.addEventListener('click', () => {
    if (document.body.classList.contains('dark-theme')) {
        document.body.classList.replace('dark-theme', 'light-theme');
        localStorage.setItem('theme', 'light-theme');
        syncThemeToggleIconVisuals('light-theme');
    } else {
        document.body.classList.replace('light-theme', 'dark-theme');
        localStorage.setItem('theme', 'dark-theme');
        syncThemeToggleIconVisuals('dark-theme');
    }
});

function syncThemeToggleIconVisuals(activeTheme) {
    if (activeTheme === 'light-theme') {
        modeIcon.className = 'fas fa-sun mode-icon';
        modeIcon.style.color = '#7209b7'; 
    } else {
        modeIcon.className = 'fas fa-moon mode-icon';
        modeIcon.style.color = '';
    }
}

// --- 3. Component Interactivity Card Tilt Engine ---
document.addEventListener("DOMContentLoaded", () => {
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".work-card, .profile-frame"), {
            max: 5,
            speed: 700,
            glare: true,
            "max-glare": 0.06,
            scale: 1.01
        });
    }
});

// --- 4. Contact Form Brief Submission interceptor ---
document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = document.querySelector('.form-submit');
    const primaryText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = 'Design Brief Launched ✔';
    submitBtn.style.background = 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))';
    
    setTimeout(() => {
        submitBtn.innerHTML = primaryText;
        submitBtn.style.background = '';
        document.getElementById('contact-form').reset();
    }, 4000);
});