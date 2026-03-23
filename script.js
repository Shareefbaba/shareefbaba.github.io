document.addEventListener("DOMContentLoaded", () => {
    const progressText = document.getElementById("progress-text");
    const progressBar = document.getElementById("progress-bar");
    const robotContainer = document.querySelector(".robot-container");
    const loadingLabel = document.querySelector(".loading-label");

    let loadProgress = 0;

    // Simulate complex system loading sequence
    const loadingStages = [
        { progress: 15, text: "INITIALIZING_KERNEL..." },
        { progress: 35, text: "LOADING_SENSORS..." },
        { progress: 60, text: "CALIBRATING_ACTUATORS..." },
        { progress: 85, text: "ESTABLISHING_UPLINK..." },
        { progress: 100, text: "SYSTEM_READY" }
    ];

    let currentStage = 0;

    // Only run loader animation if loader elements exist
    if (progressText && progressBar && robotContainer) {
        const interval = setInterval(() => {
            loadProgress += Math.floor(Math.random() * 5) + 1;

            if (loadProgress >= 100) {
                loadProgress = 100;
                clearInterval(interval);
                finishLoading();
            }

            progressText.innerText = `${loadProgress}%`;
            progressBar.style.width = `${loadProgress}%`;
            robotContainer.style.left = `${loadProgress}%`;

            if (currentStage < loadingStages.length && loadProgress >= loadingStages[currentStage].progress) {
                if (loadingLabel) loadingLabel.innerText = loadingStages[currentStage].text;
                currentStage++;
            }
        }, 50);
    } else {
        // Pages that skip loader (about, projects, certificates) go straight to cursor
        finishLoading();
    }

    function finishLoading() {
        setTimeout(() => {
            document.body.classList.add("loaded");

            if (window.particlesJS) {
                particlesJS("particles-js", particlesConfig);
            }

            if (document.body.classList.contains('loaded')) {
                initCursor();
            } else {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.attributeName === 'class' && document.body.classList.contains('loaded')) {
                            initCursor();
                            observer.disconnect();
                        }
                    });
                });
                observer.observe(document.body, { attributes: true });
            }
        }, 600);
    }

    // ─────────────────────────────────────────────
    //  Custom Spider Cursor + Idle Fall/Climb Logic
    // ─────────────────────────────────────────────
    function initCursor() {
        const cursor = document.getElementById('robot-cursor');
        if (!cursor) return;

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;
        let lastDotTime = 0;

        // ── Spider fall/climb state ──
        let fallOffset = 0;
        let isFalling = false;
        let idleTimer = null;
        let fallAnimFrame = null;

        // ── Web strand element (the dangling thread) ──
        const webStrand = document.createElement('div');
        webStrand.style.cssText = `
            position: fixed;
            width: 1.5px;
            background: linear-gradient(to bottom, rgba(230, 57, 70, 0.9), rgba(230, 57, 70, 0.15));
            pointer-events: none;
            z-index: 9997;
            display: none;
            border-radius: 2px;
        `;
        document.body.appendChild(webStrand);

        // ── Start idle timer (resets on every mouse move) ──
        function startIdleTimer() {
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => {
                if (!isFalling) triggerFall();
            }, 3000);
        }

        // ── Fall: spider drops down like it lost grip ──
        function triggerFall() {
            isFalling = true;
            const startTime = performance.now();
            const fallDistance = 170;
            const fallDuration = 650;

            webStrand.style.display = 'block';

            function animateFall(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / fallDuration, 1);
                // Ease-in (gravity acceleration)
                const eased = progress * progress;
                fallOffset = eased * fallDistance;

                // Update the web strand — anchored at cursor rest position
                webStrand.style.left = (cursorX - 0.75) + 'px';
                webStrand.style.top = cursorY + 'px';
                webStrand.style.height = fallOffset + 'px';

                if (progress < 1) {
                    fallAnimFrame = requestAnimationFrame(animateFall);
                } else {
                    fallOffset = fallDistance;
                    // Hang at bottom briefly, then start climbing
                    setTimeout(triggerClimb, 450);
                }
            }
            fallAnimFrame = requestAnimationFrame(animateFall);
        }

        // ── Climb: spider pulls itself back up ──
        function triggerClimb() {
            const startTime = performance.now();
            const fallDistance = 170;
            const climbDuration = 1500;

            function animateClimb(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / climbDuration, 1);

                // Slight "stutter-step" feel: ease-out with small bumps
                const smooth = 1 - Math.pow(1 - progress, 2.5);
                fallOffset = fallDistance * (1 - smooth);

                // Update the web strand
                webStrand.style.left = (cursorX - 0.75) + 'px';
                webStrand.style.top = cursorY + 'px';
                webStrand.style.height = fallOffset + 'px';

                if (progress < 1) {
                    fallAnimFrame = requestAnimationFrame(animateClimb);
                } else {
                    fallOffset = 0;
                    isFalling = false;
                    webStrand.style.display = 'none';
                    // Restart idle watcher after climbing
                    startIdleTimer();
                }
            }
            fallAnimFrame = requestAnimationFrame(animateClimb);
        }

        // ── Cancel fall if mouse moves ──
        function cancelFall() {
            if (isFalling) {
                cancelAnimationFrame(fallAnimFrame);
                isFalling = false;
                fallOffset = 0;
                webStrand.style.display = 'none';
            }
        }

        // ── Track mouse movement ──
        window.addEventListener('mousemove', (e) => {
            cancelFall();
            mouseX = e.clientX;
            mouseY = e.clientY;

            const now = Date.now();
            if (now - lastDotTime > 50) {
                createTrailDot(mouseX, mouseY);
                lastDotTime = now;
            }

            startIdleTimer();
        });

        // ── Main cursor animation loop ──
        function animateCursor() {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;

            cursorX += dx * 0.2;
            cursorY += dy * 0.2;

            let angle = 0;
            if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
                angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
            }

            // When falling/climbing, spider moves below cursor but thread stays anchored above
            cursor.style.transform = `translate(${cursorX}px, ${cursorY + fallOffset}px) rotate(${angle}deg)`;

            requestAnimationFrame(animateCursor);
        }

        animateCursor();
        startIdleTimer(); // Begin watching for idle from the start

        // ── Glowing red trail dots ──
        function createTrailDot(x, y) {
            const hoveredElements = document.elementsFromPoint(x, y);
            const isHoveringClickable = hoveredElements.some(el =>
                el.tagName === 'A' || el.tagName === 'BUTTON' ||
                el.classList.contains('glass-card') || el.classList.contains('play-button')
            );

            if (isHoveringClickable) return;

            const dot = document.createElement('div');
            dot.className = 'trail-dot';
            dot.style.left = `${x}px`;
            dot.style.top = `${y}px`;

            document.body.appendChild(dot);

            setTimeout(() => {
                dot.style.opacity = '0';
                dot.style.transform = 'translate(-50%, -50%) scale(0.1)';
            }, 100);

            setTimeout(() => {
                if (dot.parentNode) dot.parentNode.removeChild(dot);
            }, 1100);
        }
    }

    // ─────────────────────────────────────────────
    //  Contact Form — Web3Forms Submission
    // ─────────────────────────────────────────────
    const contactForm = document.getElementById('contact-form');
    const formStatus  = document.getElementById('form-status');
    const submitBtn   = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            submitBtn.disabled = true;
            submitBtn.querySelector('.btn-text').textContent = 'TRANSMITTING...';

            const formData = new FormData(contactForm);

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    // Note: Do NOT set Content-Type header when sending FormData with fetch
                    body: formData
                });
                const result = await response.json();

                if (result.success) {
                    formStatus.style.display = 'block';
                    formStatus.style.color = '#4ade80';
                    formStatus.style.background = 'rgba(74,222,128,0.08)';
                    formStatus.style.border = '1px solid rgba(74,222,128,0.3)';
                    formStatus.textContent = '✓ TRANSMISSION_SUCCESS — Message received. Will respond soon.';
                    contactForm.reset();

                } else {
                    throw new Error(result.message);
                }
            } catch (err) {
                formStatus.style.display = 'block';
                formStatus.style.color = '#e63946';
                formStatus.style.background = 'rgba(230,57,70,0.08)';
                formStatus.style.border = '1px solid rgba(230,57,70,0.3)';
                formStatus.textContent = '✗ TRANSMISSION_FAILED — ' + err.message + ' (Original: Email directly: shareefbaba1404@gmail.com)';
            } finally {
                submitBtn.disabled = false;
                submitBtn.querySelector('.btn-text').textContent = 'TRANSMIT DATA';
                setTimeout(() => { formStatus.style.display = 'none'; }, 8000);
            }
        });
    }


});
