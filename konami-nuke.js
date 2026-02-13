// Konami Code Nuclear Animation
let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    
    if (key === konamiCode[konamiIndex].toLowerCase() || 
        (konamiCode[konamiIndex] === 'b' && key === 'b') ||
        (konamiCode[konamiIndex] === 'a' && key === 'a')) {
        
        konamiIndex++;
        
        if (konamiIndex === konamiCode.length) {
            triggerNukeAnimation();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

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

function triggerNukeAnimation() {
    console.log('☢️ KONAMI CODE ACTIVATED - NUCLEAR DETONATION');
    
    // Unlock achievement
    if (typeof unlockAchievement === 'function') {
        unlockAchievement('nukeTriggered');
    }
    
    // Flash effect
    const flash = document.createElement('div');
    flash.className = 'nuke-flash';
    document.body.appendChild(flash);
    
    // Screen shake
    document.body.classList.add('nuke-shake');
    
    // Ground fireball
    setTimeout(() => {
        const fireball = document.createElement('div');
        fireball.className = 'nuke-fireball';
        document.body.appendChild(fireball);
        setTimeout(() => fireball.remove(), 2000);
    }, 100);
    
    // Multiple shockwaves
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
        
        setTimeout(() => {
            createNukeFallout();
        }, 1100);
    }, 400);
    
    // Cleanup flash and shake
    setTimeout(() => {
        flash.remove();
        document.body.classList.remove('nuke-shake');
    }, 3000);
}