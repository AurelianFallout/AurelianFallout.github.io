// Cain Boom — type "boom" to play TBLCRD_NE_00–30 at 3fps, centered on page

(function () {
    const FPS = 10;
    const FRAME_MS = 1000 / FPS;
    const frames = [];
    for (let i = 0; i <= 30; i++) {
        frames.push('Assets/images/Tim/TBLCRD_NE_' + String(i).padStart(2, '0') + '.png');
    }

    let buffer = [];
    let active = false;

    function play() {
        if (active) return;
        active = true;
        if (typeof unlockAchievement === 'function') unlockAchievement('cainBoom');

        const img = document.createElement('img');
        img.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 99999;
            image-rendering: pixelated;
            pointer-events: none;
        `;
        img.src = frames[0];
        document.body.appendChild(img);

        let i = 1;
        const ticker = setInterval(() => {
            if (i >= frames.length) {
                clearInterval(ticker);
                img.remove();
                active = false;
                return;
            }
            img.src = frames[i++];
        }, FRAME_MS);
    }

    document.addEventListener('keydown', (e) => {
        const tag = document.activeElement && document.activeElement.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        const key = e.key.toLowerCase();
        if (key.length !== 1) { buffer = []; return; }
        buffer.push(key);
        if (buffer.length > 4) buffer.shift();
        if (buffer.join('') === 'boom') { buffer = []; play(); }
    });
})();