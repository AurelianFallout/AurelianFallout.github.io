// Cain Boom — type "boom" to play TBLCRD_NE_00–30 at 10fps

(function () {
    const FPS = 10;
    const FRAME_MS = 1000 / FPS;
    let active = false;
    let frames = [];
    let currentFrame = 0;

    function preloadAllFrames() {
        return new Promise((resolve) => {
            let loadedCount = 0;
            frames = [];
            
            // Try different possible paths for GitHub Pages
            const paths = [
                '',  // root
                '/', // root with slash
                '/Assets/images/Tim/',
                '/images/Tim/',
                'Assets/images/Tim/',
                'images/Tim/',
                'Tim/'
            ];
            
            // We'll test which path works by trying to load frame 00
            function findWorkingPath() {
                return new Promise((resolvePath) => {
                    let pathIndex = 0;
                    
                    function testNextPath() {
                        if (pathIndex >= paths.length) {
                            console.warn('No working path found');
                            resolvePath(''); // fallback to root
                            return;
                        }
                        
                        const testImg = new Image();
                        const testPath = paths[pathIndex] + 'TBLCRD_NE_00.png';
                        
                        testImg.onload = () => {
                            console.log(`✓ Found working path: ${paths[pathIndex]}`);
                            resolvePath(paths[pathIndex]);
                        };
                        
                        testImg.onerror = () => {
                            console.log(`✗ Path failed: ${paths[pathIndex]}`);
                            pathIndex++;
                            testNextPath();
                        };
                        
                        testImg.src = testPath;
                    }
                    
                    testNextPath();
                });
            }
            
            // Once we find the working path, load all frames
            findWorkingPath().then(workingPath => {
                console.log(`Loading frames from: ${workingPath}`);
                
                for (let i = 0; i <= 30; i++) {
                    const frameNum = String(i).padStart(2, '0');
                    const img = new Image();
                    
                    img.onload = () => {
                        loadedCount++;
                        frames[i] = img;
                        console.log(`Loaded frame ${i} (${loadedCount}/31)`);
                        
                        if (loadedCount === 31) {
                            console.log('✓ All frames loaded!');
                            resolve(frames);
                        }
                    };
                    
                    img.onerror = () => {
                        console.error(`✗ Failed to load frame ${i}: TBLCRD_NE_${frameNum}.png`);
                        loadedCount++;
                        // Create a colored fallback frame so animation still works
                        const canvas = document.createElement('canvas');
                        canvas.width = 800;
                        canvas.height = 600;
                        const ctx = canvas.getContext('2d');
                        
                        // Different color for each frame so we can see animation
                        const hue = (i * 12) % 360;
                        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
                        ctx.fillRect(0, 0, 800, 600);
                        
                        // Frame number
                        ctx.fillStyle = '#000';
                        ctx.font = 'bold 48px monospace';
                        ctx.fillText(`FRAME ${i}`, 200, 300);
                        
                        const fallbackImg = new Image();
                        fallbackImg.src = canvas.toDataURL();
                        frames[i] = fallbackImg;
                        
                        if (loadedCount === 31) {
                            console.log('✓ All frames loaded (with fallbacks)');
                            resolve(frames);
                        }
                    };
                    
                    img.src = workingPath + 'TBLCRD_NE_' + frameNum + '.png';
                }
            });
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

        // Create container
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            z-index: 99999;
            display: flex;
            justify-content: center;
            align-items: center;
            pointer-events: none;
        `;
        
        const img = document.createElement('img');
        img.style.cssText = `
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            image-rendering: pixelated;
        `;
        
        // Add loading text
        const loading = document.createElement('div');
        loading.style.cssText = `
            position: absolute;
            bottom: 50px;
            left: 50%;
            transform: translateX(-50%);
            color: #ff0;
            font-family: 'Share Tech Mono', monospace;
            font-size: 14px;
            text-shadow: 0 0 10px #f00;
        `;
        loading.textContent = '> LOADING NUKE FRAMES... <';
        
        container.appendChild(img);
        container.appendChild(loading);
        document.body.appendChild(container);

        // Preload all frames first, then animate
        preloadAllFrames().then(loadedFrames => {
            loading.remove();
            
            // Show first frame
            currentFrame = 0;
            img.src = loadedFrames[0].src;
            
            // Animate through frames
            const interval = setInterval(() => {
                currentFrame++;
                
                if (currentFrame >= loadedFrames.length) {
                    clearInterval(interval);
                    
                    // Show completion message
                    loading.textContent = '> DETONATION COMPLETE <';
                    loading.style.color = '#f00';
                    container.appendChild(loading);
                    
                    setTimeout(() => {
                        container.remove();
                        active = false;
                    }, 1500);
                    
                    return;
                }
                
                img.src = loadedFrames[currentFrame].src;
                
                // Update progress
                if (currentFrame === 1) {
                    const progress = document.createElement('div');
                    progress.style.cssText = `
                        position: absolute;
                        bottom: 50px;
                        left: 50%;
                        transform: translateX(-50%);
                        color: #ff0;
                        font-family: 'Share Tech Mono', monospace;
                        font-size: 12px;
                    `;
                    progress.id = 'nuke-progress';
                    container.appendChild(progress);
                }
                
                const progress = document.getElementById('nuke-progress');
                if (progress) {
                    const percent = Math.floor((currentFrame / loadedFrames.length) * 100);
                    progress.textContent = `> ${percent}% DETONATED <`;
                }
                
            }, FRAME_MS);
        });
    }

    // Type "boom" to trigger
    let buffer = [];
    document.addEventListener('keydown', (e) => {
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