// Konami Code Nuclear Animation
// Wait for DOM to be ready before hooking in
(function() {
    'use strict';

let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;
let konamiProgress = null; // HUD element showing input progress

function initKonami() {
    createProgressHUD();

    document.addEventListener('keydown', (e) => {
        const key = e.key;
        const expected = konamiCode[konamiIndex];

        if (key.toLowerCase() === expected.toLowerCase()) {
            konamiIndex++;
            updateProgressHUD();

            if (konamiIndex === konamiCode.length) {
                triggerNukeAnimation();
                konamiIndex = 0;
                resetProgressHUD();
            }
        } else {
            konamiIndex = 0;
            resetProgressHUD();
        }
    });
}

// ─── PROGRESS HUD ────────────────────────────────────────────────────────────
const konamiSymbols = ['↑','↑','↓','↓','←','→','←','→','B','A'];

function createProgressHUD() {
    konamiProgress = document.createElement('div');
    konamiProgress.id = 'konami-hud';
    konamiProgress.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 6px;
        z-index: 99999;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s;
    `;
    konamiSymbols.forEach((sym, i) => {
        const span = document.createElement('span');
        span.dataset.index = i;
        span.textContent = sym;
        span.style.cssText = `
            font-family: monospace;
            font-size: 18px;
            color: #555;
            text-shadow: none;
            transition: color 0.15s, text-shadow 0.15s;
        `;
        konamiProgress.appendChild(span);
    });
    document.body.appendChild(konamiProgress);
}

function updateProgressHUD() {
    if (!konamiProgress) return;
    konamiProgress.style.opacity = '1';
    const spans = konamiProgress.querySelectorAll('span');
    spans.forEach((s, i) => {
        if (i < konamiIndex) {
            s.style.color = '#ff4400';
            s.style.textShadow = '0 0 8px #ff4400';
        } else {
            s.style.color = '#555';
            s.style.textShadow = 'none';
        }
    });
    // Pulse the next expected key
    if (konamiIndex < spans.length) {
        spans[konamiIndex].style.color = '#888';
    }
}

function resetProgressHUD() {
    if (!konamiProgress) return;
    const spans = konamiProgress.querySelectorAll('span');
    spans.forEach(s => {
        s.style.color = '#555';
        s.style.textShadow = 'none';
    });
    // Hide after a short delay if no progress
    if (konamiIndex === 0) {
        setTimeout(() => {
            if (konamiIndex === 0 && konamiProgress) konamiProgress.style.opacity = '0';
        }, 1500);
    }
}

// ─── DEBRIS ───────────────────────────────────────────────────────────────────
function createNukeDebris(container, count) {
    for (let i = 0; i < count; i++) {
        const debris = document.createElement('div');
        debris.className = 'nuke-debris';
        const angle = (Math.random() * 180) - 90;
        const distance = Math.random() * 400 + 200;
        const tx = Math.cos(angle * Math.PI / 180) * distance;
        const ty = Math.sin(angle * Math.PI / 180) * distance - 200;

        debris.style.left = '50%';
        debris.style.bottom = '0';
        debris.style.setProperty('--tx', tx + 'px');
        debris.style.setProperty('--ty', ty + 'px');
        debris.style.animationDelay = Math.random() * 0.3 + 's';

        container.appendChild(debris);
        setTimeout(() => debris.remove(), 3000);
    }
}

// ─── SHOCKWAVE GROUND CRACK ───────────────────────────────────────────────────
function createGroundCrack() {
    const crack = document.createElement('div');
    crack.className = 'nuke-ground-crack';
    document.body.appendChild(crack);
    setTimeout(() => crack.remove(), 3000);
}

// ─── EMP GLITCH OVERLAY ───────────────────────────────────────────────────────
function createEMPGlitch() {
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const glitch = document.createElement('div');
            glitch.className = 'nuke-emp-glitch';
            const h = Math.random() * 60 + 5;
            glitch.style.top = Math.random() * 100 + '%';
            glitch.style.height = h + 'px';
            glitch.style.opacity = Math.random() * 0.4 + 0.1;
            document.body.appendChild(glitch);
            setTimeout(() => glitch.remove(), 200);
        }, i * 80);
    }
}

// ─── RADIATION COUNTER ────────────────────────────────────────────────────────
function showRadCounter() {
    const counter = document.createElement('div');
    counter.className = 'nuke-rad-counter';
    counter.innerHTML = '☢ RAD: <span id="rad-val">0</span> mSv';
    document.body.appendChild(counter);

    let val = 0;
    const target = Math.floor(Math.random() * 900 + 400);
    const interval = setInterval(() => {
        val += Math.floor(Math.random() * 40 + 10);
        if (val >= target) { val = target; clearInterval(interval); }
        const el = document.getElementById('rad-val');
        if (el) el.textContent = val;
    }, 80);

    setTimeout(() => {
        counter.style.transition = 'opacity 1s';
        counter.style.opacity = '0';
        setTimeout(() => counter.remove(), 1000);
    }, 8000);
}

// ─── FALLOUT ──────────────────────────────────────────────────────────────────
function createNukeFallout() {
    const falloutContainer = document.createElement('div');
    falloutContainer.className = 'nuke-fallout-container';

    const overlay = document.createElement('div');
    overlay.className = 'nuke-fallout-overlay';
    document.body.appendChild(overlay);

    const ashCount = 60;
    for (let i = 0; i < ashCount; i++) {
        setTimeout(() => {
            const ash = document.createElement('div');
            ash.className = 'nuke-ash-particle';
            const size = Math.random() * 4 + 2;
            ash.style.width = size + 'px';
            ash.style.height = size + 'px';
            ash.style.left = Math.random() * 100 + '%';
            ash.style.top = '-20px';
            const drift = (Math.random() - 0.5) * 100;
            ash.style.setProperty('--drift', drift + 'px');
            const duration = Math.random() * 3 + 4;
            ash.style.animationDuration = duration + 's';
            ash.style.animationDelay = Math.random() * 2 + 's';
            falloutContainer.appendChild(ash);
            setTimeout(() => ash.remove(), (duration + 2) * 1000);
        }, i * 100);
    }

    const radioCount = 20;
    for (let i = 0; i < radioCount; i++) {
        setTimeout(() => {
            const radio = document.createElement('div');
            radio.className = 'nuke-radioactive-particle';
            const size = Math.random() * 3 + 2;
            radio.style.width = size + 'px';
            radio.style.height = size + 'px';
            radio.style.left = Math.random() * 100 + '%';
            radio.style.top = '-20px';
            const drift = (Math.random() - 0.5) * 120;
            radio.style.setProperty('--drift', drift + 'px');
            const duration = Math.random() * 4 + 5;
            radio.style.animationDuration = duration + 's';
            radio.style.animationDelay = Math.random() * 3 + 's';
            falloutContainer.appendChild(radio);
            setTimeout(() => radio.remove(), (duration + 3) * 1000);
        }, i * 150);
    }

    document.body.appendChild(falloutContainer);

    setTimeout(() => {
        falloutContainer.style.transition = 'opacity 2s ease-out';
        falloutContainer.style.opacity = '0';
        overlay.style.transition = 'opacity 2s ease-out';
        overlay.style.opacity = '0';
        setTimeout(() => {
            falloutContainer.remove();
            overlay.remove();
        }, 2000);
    }, 10000);
}

// ─── MAIN TRIGGER ─────────────────────────────────────────────────────────────
function triggerNukeAnimation() {
    console.log('☢️ KONAMI CODE ACTIVATED - NUCLEAR DETONATION');

    if (typeof unlockAchievement === 'function') {
        unlockAchievement('nukeTriggered');
    }

    // EMP horizontal glitch lines burst
    createEMPGlitch();

    // Flash
    const flash = document.createElement('div');
    flash.className = 'nuke-flash';
    document.body.appendChild(flash);

    // Screen shake
    const shakeEl = document.createElement('div');
    shakeEl.style.cssText = 'position:fixed;inset:0;z-index:9990;pointer-events:none;';
    shakeEl.classList.add('nuke-shake');
    document.body.appendChild(shakeEl);

    // Ground crack at impact point
    setTimeout(() => createGroundCrack(), 50);

    // Fireball
    setTimeout(() => {
        const fireball = document.createElement('div');
        fireball.className = 'nuke-fireball';
        document.body.appendChild(fireball);
        setTimeout(() => fireball.remove(), 2000);
    }, 100);

    // Shockwaves
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const shockwave = document.createElement('div');
            shockwave.className = 'nuke-shockwave';
            document.body.appendChild(shockwave);
            setTimeout(() => shockwave.remove(), 2500);
        }, 200 + i * 400);
    }

    // Heat waves
    setTimeout(() => {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const heatWave = document.createElement('div');
                heatWave.className = 'nuke-heat-wave';
                document.body.appendChild(heatWave);
                setTimeout(() => heatWave.remove(), 1500);
            }, i * 300);
        }
    }, 300);

    // Mushroom cloud
    setTimeout(() => {
        const mushroomContainer = document.createElement('div');
        mushroomContainer.className = 'nuke-mushroom-container';

        const mushroomCloud = document.createElement('div');
        mushroomCloud.className = 'nuke-mushroom-cloud';

        const cap = document.createElement('div');
        cap.className = 'nuke-mushroom-cap';

        for (let i = 0; i < 7; i++) {
            const puff = document.createElement('div');
            puff.className = 'nuke-cloud-puff';
            cap.appendChild(puff);
        }

        const turbulence = document.createElement('div');
        turbulence.className = 'nuke-turbulence';
        cap.appendChild(turbulence);

        const stem = document.createElement('div');
        stem.className = 'nuke-mushroom-stem';

        const core = document.createElement('div');
        core.className = 'nuke-stem-core';
        stem.appendChild(core);

        for (let i = 0; i < 7; i++) {
            const plume = document.createElement('div');
            plume.className = 'nuke-stem-plume';
            stem.appendChild(plume);
        }

        mushroomCloud.appendChild(cap);
        mushroomCloud.appendChild(stem);
        mushroomContainer.appendChild(mushroomCloud);
        document.body.appendChild(mushroomContainer);

        createNukeDebris(mushroomContainer, 50);

        setTimeout(() => mushroomContainer.remove(), 2000);
        setTimeout(() => createNukeFallout(), 1100);
    }, 400);

    // Radiation counter
    setTimeout(() => showRadCounter(), 1500);

    // Cleanup
    setTimeout(() => {
        flash.remove();
        shakeEl.remove();
    }, 3000);
}

// ─── CAIN BOOM EASTER EGG ─────────────────────────────────────────────────────
// Type "boom" anywhere (not in an input) to trigger Fallout 1-style flipbook
// of frames from Assets/images/Tim/ at 40fps

(function() {
    const BOOM_SEQUENCE = ['b','o','o','m'];
    const FRAME_MS = 1000 / 40; // 40fps = 25ms per frame

    let boomBuffer = [];
    let boomActive = false;
    let cachedFrames = null;

    // Build candidate paths Tim_001.png ... Tim_200.png
    // Adjust the filename pattern here if your files differ
    function buildFrameList() {
        const frames = [];
        for (let i = 1; i <= 200; i++) {
            frames.push(`Assets/images/Tim/Tim_${String(i).padStart(3,'0')}.png`);
        }
        return frames;
    }

    // Probe which paths actually resolve (filter out 404s)
    function probeFrames(candidates, callback) {
        const valid = [];
        let remaining = candidates.length;

        candidates.forEach((src, idx) => {
            const img = new Image();
            img.onload  = () => { valid.push({ src, idx }); done(); };
            img.onerror = () => { done(); };
            img.src = src;
            function done() {
                if (--remaining === 0) {
                    valid.sort((a, b) => a.idx - b.idx);
                    callback(valid.map(v => v.src));
                }
            }
        });
    }

    function triggerCainBoom() {
        if (boomActive) return;
        boomActive = true;

        if (cachedFrames) {
            playFlipbook(cachedFrames);
            return;
        }

        // Loading indicator while probing
        const loader = document.createElement('div');
        loader.style.cssText = `
            position:fixed; top:50%; left:50%; transform:translate(-50%,-50%);
            font-family:monospace; font-size:14px; color:#ff4400;
            text-shadow:0 0 8px #ff4400; z-index:99999; pointer-events:none;
            letter-spacing:0.1em;
        `;
        loader.textContent = '';
        document.body.appendChild(loader);

        probeFrames(buildFrameList(), (frames) => {
            loader.remove();
            if (!frames.length) {
                console.warn('Cain Boom: no frames found in Assets/images/Tim/');
                boomActive = false;
                return;
            }
            cachedFrames = frames;
            playFlipbook(frames);
        });
    }

    function playFlipbook(frames) {
        // Black fullscreen overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position:fixed; inset:0; background:#000; z-index:99998;
            display:flex; flex-direction:column;
            align-items:center; justify-content:center; cursor:pointer;
        `;

        let ticker;
        const dismiss = () => {
            clearInterval(ticker);
            overlay.remove();
            document.removeEventListener('keydown', onKey);
            boomActive = false;
        };
        const onKey = () => dismiss();
        overlay.addEventListener('click', dismiss);
        document.addEventListener('keydown', onKey, { once: true });

        // The image element — pixelated rendering keeps the retro look
        const img = document.createElement('img');
        img.style.cssText = `
            max-width:100%; max-height:90vh;
            object-fit:contain; image-rendering:pixelated;
        `;
        img.src = frames[0];

        // Subtle frame counter at the bottom
        const info = document.createElement('div');
        info.style.cssText = `
            position:absolute; bottom:16px; left:50%; transform:translateX(-50%);
            font-family:monospace; font-size:11px; color:rgba(255,100,0,0.45);
            pointer-events:none; letter-spacing:0.08em; white-space:nowrap;
        `;
        info.textContent = `FRAME 1/${frames.length}  ·  CLICK OR ANY KEY TO DISMISS`;

        overlay.appendChild(img);
        overlay.appendChild(info);
        document.body.appendChild(overlay);

        let frameIndex = 0;

        ticker = setInterval(() => {
            frameIndex++;
            if (frameIndex >= frames.length) {
                clearInterval(ticker);
                // Hold last frame briefly then auto-dismiss
                setTimeout(dismiss, 1500);
                return;
            }
            img.src = frames[frameIndex];
            info.textContent = `FRAME ${frameIndex + 1}/${frames.length}  ·  CLICK OR ANY KEY TO DISMISS`;
        }, FRAME_MS);
    }

    // Key listener: buffer last 4 chars, fire on "boom"
    function initBoomListener() {
        document.addEventListener('keydown', (e) => {
            const tag = document.activeElement && document.activeElement.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA') return;
            const key = e.key.toLowerCase();
            if (key.length !== 1) { boomBuffer = []; return; }

            boomBuffer.push(key);
            if (boomBuffer.length > BOOM_SEQUENCE.length) boomBuffer.shift();

            if (boomBuffer.join('') === 'boom') {
                boomBuffer = [];
                triggerCainBoom();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBoomListener);
    } else {
        initBoomListener();
    }
})();

// Boot when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKonami);
} else {
    initKonami();
}

})(); // end IIFE