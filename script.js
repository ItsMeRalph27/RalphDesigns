document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Mechanical Shutter Router Engine ---
    const routeLinks = document.querySelectorAll(".routing-link");
    const panels = document.querySelectorAll(".view-panel");
    let interfaceTransitionLock = false;

    function executeScannerTransition(targetHashId) {
        if (interfaceTransitionLock) return;
        interfaceTransitionLock = true;

        document.body.classList.add("scanner-active");

        setTimeout(() => {
            panels.forEach(panel => {
                panel.classList.remove("active-panel");
                if (`#${panel.id}` === targetHashId) {
                    panel.classList.add("active-panel");
                }
            });

            const dynamicContainer = document.querySelector(".panel-container.large-layout-scroller");
            if(dynamicContainer) dynamicContainer.scrollTop = 0;

            document.body.classList.remove("scanner-active");
        }, 550);

        setTimeout(() => {
            interfaceTransitionLock = false;
        }, 1100);
    }

    routeLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const hashValue = link.getAttribute("href");
            if (hashValue.startsWith("#")) {
                e.preventDefault();
                const targetViewElement = document.querySelector(hashValue);
                if (targetViewElement && !targetViewElement.classList.contains("active-panel")) {
                    history.pushState(null, null, hashValue);
                    executeScannerTransition(hashValue);
                }
            }
        });
    });

    window.addEventListener("popstate", () => {
        const structuralHash = window.location.hash || "#intro";
        executeScannerTransition(structuralHash);
    });

    // --- 2. Advanced Interactive Lightning & Moving Doodle Canvas Matrix ---
    const canvas = document.getElementById("portfolioMatrixCanvas");
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let doodleShapesArray = [];
    let lightningBranchesArray = [];
    let lightningFlashAlpha = 0;
    const mouseCoordinates = { x: null, y: null };

    window.addEventListener("mousemove", (e) => {
        mouseCoordinates.x = e.clientX;
        mouseCoordinates.y = e.clientY;
    });

    window.addEventListener("mouseout", () => {
        mouseCoordinates.x = null;
        mouseCoordinates.y = null;
    });

    class MovingDoodleNode {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.radius = Math.random() * 20 + 10;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.baseVx = this.vx;
            this.baseVy = this.vy;
            this.shapeType = Math.floor(Math.random() * 4); // 0: cross, 1: radar ring, 2: bracket, 3: dot
        }

        stepAnimation() {
            if (mouseCoordinates.x !== null && mouseCoordinates.y !== null) {
                const dx = mouseCoordinates.x - this.x;
                const dy = mouseCoordinates.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 180) {
                    this.vx = this.baseVx + (dx / dist) * 0.9;
                    this.vy = this.baseVy + (dy / dist) * 0.9;
                } else {
                    this.vx += (this.baseVx - this.vx) * 0.05;
                    this.vy += (this.baseVy - this.vy) * 0.05;
                }
            }

            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.baseVx *= -1;
            if (this.y < 0 || this.y > height) this.baseVy *= -1;
        }

        renderShape(inkColor) {
            ctx.save();
            ctx.strokeStyle = inkColor;
            ctx.fillStyle = inkColor;
            ctx.lineWidth = 1;

            switch(this.shapeType) {
                case 0: // Vector Cross
                    ctx.beginPath();
                    ctx.moveTo(this.x - 8, this.y); ctx.lineTo(this.x + 8, this.y);
                    ctx.moveTo(this.x, this.y - 8); ctx.lineTo(this.x, this.y + 8);
                    ctx.stroke();
                    break;
                case 1: // Dotted Radar Ring
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.setLineDash([4, 4]);
                    ctx.stroke();
                    break;
                case 2: // Blueprint Corner Brackets
                    ctx.beginPath();
                    ctx.moveTo(this.x - 6, this.y - 12); ctx.lineTo(this.x - 12, this.y - 12); ctx.lineTo(this.x - 12, this.y - 6);
                    ctx.moveTo(this.x + 6, this.y + 12); ctx.lineTo(this.x + 12, this.y + 12); ctx.lineTo(this.x + 12, this.y + 6);
                    ctx.stroke();
                    break;
                case 3: // Structural Node
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
                    ctx.fill();
                    break;
            }
            ctx.restore();
        }
    }

    function createLightningStrike() {
        lightningBranchesArray = [];
        let startX = Math.random() * width;
        let startY = 0;
        let segmentsCount = Math.floor(Math.random() * 20) + 15;
        
        let currentX = startX;
        let currentY = startY;

        for (let i = 0; i < segmentsCount; i++) {
            let nextY = currentY + (height / segmentsCount);
            let nextX = currentX + (Math.random() - 0.5) * 90;

            // Constrain coordinates within viewport boundary bounds
            nextX = Math.max(0, Math.min(width, nextX));

            lightningBranchesArray.push({ x1: currentX, y1: currentY, x2: nextX, y2: nextY });

            // Generate occasional side-branch offsets
            if (Math.random() < 0.22) {
                let branchX = nextX + (Math.random() - 0.5) * 60;
                lightningBranchesArray.push({ x1: nextX, y1: nextY, x2: branchX, y2: nextY + (Math.random() * 30) });
            }

            currentX = nextX;
            currentY = nextY;
        }
        lightningFlashAlpha = 1.0; 
    }

    function initCanvasGeometry() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        
        doodleShapesArray = [];
        const dynamicDensity = Math.floor((width * height) / 24000);
        for(let i = 0; i < Math.min(dynamicDensity, 60); i++) {
            doodleShapesArray.push(new MovingDoodleNode());
        }
    }

    function processingRenderLoop() {
        ctx.clearRect(0, 0, width, height);
        
        const styleTokens = getComputedStyle(document.body);
        const dynamicCyan = styleTokens.getPropertyValue('--accent-cyan').trim() || '#00f5d4';
        const lineInk = styleTokens.getPropertyValue('--doodle-line').trim() || 'rgba(0, 245, 212, 0.1)';

        // ⚡ Render background lightning bolt discharge flash
         if (lightningFlashAlpha > 0) {
            ctx.save();
            ctx.strokeStyle = dynamicCyan;
            ctx.shadowBlur = 30;
            ctx.shadowColor = dynamicCyan;
            
            lightningBranchesArray.forEach(seg => {
                ctx.lineWidth = (Math.random() * 2 + 1) * lightningFlashAlpha;
                ctx.beginPath();
                ctx.moveTo(seg.x1, seg.y1);
                ctx.lineTo(seg.x2, seg.y2);
                ctx.stroke();
            });
            ctx.restore();
            
            // ADJUSTED: Increased from 0.045 to 0.09 for a medium-fast discharge fade execution
            lightningFlashAlpha -= 0.09;
        }

        // ADJUSTED: Increased from 0.006 to 0.015 so strikes happen slightly more often to feel snappy
        if (Math.random() < 0.015) {
            createLightningStrike();
        }   

        // 🎨 Render continuous floating technical background doodles
        doodleShapesArray.forEach(shape => {
            shape.stepAnimation();
            shape.renderShape(lineInk);
        });

        requestAnimationFrame(processingRenderLoop);
    }

    window.addEventListener('resize', initCanvasGeometry);
    initCanvasGeometry();
    processingRenderLoop();

    // --- 3. 3D Card Depth Slider Architecture Engine ---
    const sliderDeckContainers = document.querySelectorAll(".slider-deck-container");
    const zoomPortal = document.getElementById("zoomPortal");
    const portalTargetImage = document.getElementById("portalTargetImage");
    const portalHeading = document.getElementById("portalHeading");
    const portalSub = document.getElementById("portalSub");
    const portalCloseTrigger = document.querySelector(".portal-close-trigger");

    sliderDeckContainers.forEach((deck) => {
        const depthCards = Array.from(deck.querySelectorAll(".depth-card"));
        const prevBtn = deck.querySelector(".prev-btn");
        const nextBtn = deck.querySelector(".next-btn");
        const paginationTrack = deck.querySelector(".slider-pagination");
        
        let slideIndex = 0;
        const totalCards = depthCards.length;

        depthCards.forEach((_, idx) => {
            const dot = document.createElement("div");
            dot.classList.add("dot-node");
            if (idx === 0) dot.classList.add("active-dot");
            dot.addEventListener("click", () => {
                if (slideIndex === idx) return;
                slideIndex = idx;
                renderDeckPerspectiveState();
            });
            paginationTrack.appendChild(dot);
        });

        const localizedDots = deck.querySelectorAll(".dot-node");

        function renderDeckPerspectiveState() {
            depthCards.forEach(c => { c.className = "depth-card"; });

            const current = slideIndex;
            const r1 = (slideIndex + 1) % totalCards;
            const r2 = (slideIndex + 2) % totalCards;
            const l1 = (slideIndex - 1 + totalCards) % totalCards;
            const l2 = (slideIndex - 2 + totalCards) % totalCards;

            depthCards[current].classList.add("state-center");
            
            if (totalCards > 1) {
                depthCards[r1].classList.add("state-right-1");
                depthCards[l1].classList.add("state-left-1");
            }
            if (totalCards > 3) {
                depthCards[r2].classList.add("state-right-2");
                depthCards[l2].classList.add("state-left-2");
            }

            localizedDots.forEach((dot, dotIdx) => {
                if (dotIdx === slideIndex) dot.classList.add("active-dot");
                else dot.classList.remove("active-dot");
            });
        }

        depthCards.forEach((card) => {
            card.addEventListener("click", () => {
                if (card.classList.contains("state-center")) {
                    const cardImg = card.querySelector("img").getAttribute("src");
                    const cardTitle = card.querySelector(".depth-card-meta h3").innerText;
                    const cardInfo = card.querySelector(".depth-card-meta span").innerText;

                    portalTargetImage.setAttribute("src", cardImg);
                    portalHeading.innerText = cardTitle;
                    portalSub.innerText = cardInfo;

                    zoomPortal.classList.add("portal-active");
                    zoomPortal.setAttribute("aria-hidden", "false");
                }
            });
        });

        nextBtn.addEventListener("click", () => {
            slideIndex = (slideIndex + 1) % totalCards;
            renderDeckPerspectiveState();
        });

        prevBtn.addEventListener("click", () => {
            slideIndex = (slideIndex - 1 + totalCards) % totalCards;
            renderDeckPerspectiveState();
        });

        renderDeckPerspectiveState();
    });

    portalCloseTrigger.addEventListener("click", () => {
        zoomPortal.classList.remove("portal-active");
        zoomPortal.setAttribute("aria-hidden", "true");
    });

    zoomPortal.addEventListener("click", (e) => {
        if (e.target === zoomPortal) {
            zoomPortal.classList.remove("portal-active");
            zoomPortal.setAttribute("aria-hidden", "true");
        }
    });

    // --- 4. Sidebar Category Tab Selector Matrix ---
    const tabTriggers = document.querySelectorAll(".tab-trigger");
    tabTriggers.forEach(tab => {
        tab.addEventListener("click", () => {
            tabTriggers.forEach(t => t.classList.remove("active-tab"));
            sliderDeckContainers.forEach(d => d.classList.remove("active-deck"));

            tab.classList.add("active-tab");
            const targetDeckId = tab.getAttribute("data-target-deck");
            document.getElementById(targetDeckId).classList.add("active-deck");
        });
    });

    // --- 5. Interface Theme Configuration Logic ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const modeIcon = themeToggleBtn.querySelector('.mode-icon');
    const systemSavedTheme = localStorage.getItem('theme') || 'dark-theme';
    
    document.body.className = systemSavedTheme;
    syncThemeToggleIconVisuals(systemSavedTheme);

    themeToggleBtn.addEventListener('click', () => {
        if (document.body.classList.contains('dark-theme')) {
            document.body.className = 'light-theme';
            localStorage.setItem('theme', 'light-theme');
            syncThemeToggleIconVisuals('light-theme');
        } else {
            document.body.className = 'dark-theme';
            localStorage.setItem('theme', 'dark-theme');
            syncThemeToggleIconVisuals('dark-theme');
        }
        initCanvasGeometry(); // Refresh canvas variables matching the colors of the current theme
    });

    function syncThemeToggleIconVisuals(currentTheme) {
        if (currentTheme === 'light-theme') {
            modeIcon.className = 'fas fa-sun mode-icon';
        } else {
            modeIcon.className = 'fas fa-moon mode-icon';
        }
    }

    // --- 6. Contact Intake Matrix Handler ---
    document.getElementById('contact-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const formSubmitBtn = document.querySelector('.form-submit-trigger');
        const defaultBtnText = formSubmitBtn.innerHTML;
        formSubmitBtn.innerHTML = 'Transmission Complete ✔';
        setTimeout(() => {
            formSubmitBtn.innerHTML = defaultBtnText;
            document.getElementById('contact-form').reset();
        }, 3000);
    });
});