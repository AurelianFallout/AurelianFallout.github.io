// Cain Boom — type "boom" to play TBLCRD_NE_00–30 at 10fps, centered on page

(function () {
    const FPS = 10;
    const FRAME_MS = 1000 / FPS;
    
    // FIX: Use relative paths that work both locally and when published
    // Try multiple possible paths - the first one that works will be used
    const FRAME_PATHS = [
        'TBLCRD_NE_',                    // Same directory as HTML
        'Assets/images/Tim/TBLCRD_NE_',   // Original path
        'images/Tim/TBLCRD_NE_',          // Alternative
        'Tim/TBLCRD_NE_',                  // Another alternative
        '/TBLCRD_NE_'                       // Root relative
    ];
    
    let frames = [];
    let active = false;
    let selectedBasePath = null;

    // Test which path works
    function findWorkingPath() {
        return new Promise((resolve) => {
            let pathIndex = 0;
            
            function testNextPath() {
                if (pathIndex >= FRAME_PATHS.length) {
                    console.warn('⚠ No working path found for frames');
                    resolve(null);
                    return;
                }
                
                const testPath = FRAME_PATHS[pathIndex] + '00.png';
                const img = new Image();
                
                img.onload = () => {
                    console.log(`✓ Found working path: ${FRAME_PATHS[pathIndex]}`);
                    resolve(FRAME_PATHS[pathIndex]);
                };
                
                img.onerror = () => {
                    pathIndex++;
                    testNextPath();
                };
                
                img.src = testPath;
            }
            
            testNextPath();
        });
    }

    function play() {
        if (active) return;
        active = true;

        // Trigger achievement
        if (typeof unlockAchievement === 'function') {
            unlockAchievement('cainBoom');
        } else {
            const event = new CustomEvent('achievementUnlock', { 
                detail: { id: 'cainBoom' } 
            });
            document.dispatchEvent(event);
        }

        const img = document.createElement('img');
        img.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 99999;
            image-rendering: pixelated;
            pointer-events: none;
            max-width: 100vw;
            max-height: 100vh;
            object-fit: contain;
        `;
        
        // Add loading indicator
        const loading = document.createElement('div');
        loading.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #ff0;
            font-family: 'Share Tech Mono', monospace;
            z-index: 100000;
        `;
        loading.textContent = '> LOADING FRAMES... <';
        document.body.appendChild(loading);
        
        document.body.appendChild(img);

        // Find working path then play
        findWorkingPath().then(basePath => {
            if (!basePath) {
                // Fallback - just show a message
                loading.remove();
                img.remove();
                active = false;
                
                const msg = document.createElement('div');
                msg.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: #f00;
                    font-family: 'Share Tech Mono', monospace;
                    font-size: 24px;
                    text-align: center;
                    z-index: 99999;
                    background: #000;
                    padding: 20px;
                    border: 2px solid #f00;
                `;
                msg.innerHTML = '☢️ BOOM! ☢️<br><span style="font-size: 16px;">(frames not found)</span>';
                document.body.appendChild(msg);
                setTimeout(() => msg.remove(), 2000);
                return;
            }
            
            selectedBasePath = basePath;
            
            // Load all frames
            let loadedCount = 0;
            frames = [];
            
            for (let i = 0; i <= 30; i++) {
                const frameNum = String(i).padStart(2, '0');
                const frameImg = new Image();
                
                frameImg.onload = () => {
                    loadedCount++;
                    frames[i] = frameImg;
                    
                    // Start playing when first frame loads
                    if (i === 0) {
                        loading.remove();
                        img.src = frameImg.src;
                    }
                    
                    // Start animation when all frames loaded or after timeout
                    if (loadedCount === 31) {
                        console.log('All frames loaded');
                    }
                };
                
                frameImg.onerror = () => {
                    loadedCount++;
                    console.warn(`Frame ${i} failed to load`);
                };
                
                frameImg.src = basePath + frameNum + '.png';
            }
            
            // Start animation after first frame
            let i = 1;
            const interval = setInterval(() => {
                if (i >= frames.length || !frames[i]) {
                    clearInterval(interval);
                    setTimeout(() => {
                        img.remove();
                        active = false;
                    }, 500);
                    return;
                }
                img.src = frames[i].src;
                i++;
            }, FRAME_MS);
        });
    }

    // Konami code style: type "boom"
    let buffer = [];
    document.addEventListener('keydown', (e) => {
        // Don't trigger if typing in input
        const tag = document.activeElement && document.activeElement.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        
        const key = e.key.toLowerCase();
        if (key.length !== 1) { 
            buffer = []; 
            return; 
        }
        
        buffer.push(key);
        if (buffer.length > 4) buffer.shift();
        
        if (buffer.join('') === 'boom') { 
            buffer = []; 
            play(); 
        }
    });

    console.log('🐉 Cain Boom loaded - type "boom" to trigger');
})();