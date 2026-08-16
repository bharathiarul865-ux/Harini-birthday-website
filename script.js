// Configuration
const PASSWORD = "Harini mama";
// Sets countdown target to 15 days from today dynamically
const COUNTDOWN_DATE = new Date().getTime() + (01 * 01 * 10 * 60 * 1000);

// Global Canvas References
let globalCanvas, globalCtx;
const bgParticles = [];
const activeConfetti = [];
const activeFireworks = [];

// DOM Loaded Event Listener
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Loaded - Initializing...");
    
    // Background Music Playback Handler
    function playMusic() {
        const music = document.getElementById("backgroundMusic");
        if (music) {
            music.volume = 0.5;
            music.play().catch(err => {
                console.log("Music play blocked by browser until user click.", err);
            });
        }
    }

    // Password Verification System
    const passwordBtn = document.getElementById("passwordBtn");
    const passwordInput = document.getElementById("passwordInput");
    
    if (passwordBtn) {
        passwordBtn.addEventListener("click", checkPassword);
    }
    
    if (passwordInput) {
        passwordInput.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                checkPassword();
            }
        });
    }

    function checkPassword() {
        const inputVal = document.getElementById("passwordInput").value;
        
        const errorSound = () => {
            const inputField = document.getElementById("passwordInput");
            inputField.style.borderColor = "#ff5252";
            inputField.style.transform = "translateX(5px)";
            setTimeout(() => inputField.style.transform = "translateX(-5px)", 80);
            setTimeout(() => {
                inputField.style.transform = "translateX(0)";
                inputField.style.borderColor = "";
            }, 160);
        };

        if (inputVal.trim() === PASSWORD.trim()) {
            startLoginTransition();
        } else {
            errorSound();
        }
    }

    // Transition from Password to Loading to Main Content
    function startLoginTransition() {
        const passScreen = document.getElementById("passwordScreen");
        const loadScreen = document.getElementById("loadingScreen");
        const mainContent = document.getElementById("mainContent");
        const loadingBar = document.getElementById("loadingBar");

        if (!passScreen || !loadScreen || !mainContent) return;

        passScreen.classList.add("hidden");
        
        setTimeout(() => {
            loadScreen.style.display = "flex";
            loadScreen.classList.remove("hidden");
            
            let progress = 0;
            const interval = setInterval(() => {
                progress += 2;
                if (loadingBar) {
                    loadingBar.style.width = progress + "%";
                }
                
                if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        loadScreen.classList.add("hidden");
                        mainContent.classList.add("active");
                        
                        // Initialize Features
                        playMusic();
                        startCountdown();
                        initUnifiedEngine(); // Balloons & Hearts floating background starts
                        initCake();
                        initGallery();
                        startTypewriter();

                        // 🌟✨ AUTOMATIC EFFECTS START HERE ✨🌟
                        
                        // 1. Page திறந்தவுடனேயே பெரிய வரவேற்பு Blast!
                        launchConfettiBlast();
                        launchFireworksShower();

                        // 2. தானாகவே ஒவ்வொரு 3 வினாடிக்கும் Confetti (பூக்கள்) வெடிக்கும்
                        setInterval(() => {
                            launchConfettiBlast();
                        }, 3000);

                        // 3. தானாகவே ஒவ்வொரு 4 வினாடிக்கும் Fireworks (வானவெடி) வெடிக்கும்
                        setInterval(() => {
                            launchFireworksShower();
                        }, 4000);

                    }, 600);
                }
            }, 30);
        }, 300);
    }

    // Celebration Countdown Timer
    function startCountdown() {
        const updateCountdown = () => {
            const now = new Date().getTime();
            const difference = COUNTDOWN_DATE - now;

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            const daysEl = document.getElementById("days");
            const hoursEl = document.getElementById("hours");
            const minutesEl = document.getElementById("minutes");
            const secondsEl = document.getElementById("seconds");

            if (daysEl) daysEl.innerText = String(days).padStart(2, "0");
            if (hoursEl) hoursEl.innerText = String(hours).padStart(2, "0");
            if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, "0");
            if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, "0");
        };
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // --- FLOATING BACKGROUND (BALLOONS, HEARTS, SPARKLES, PETALS) ---

    class FloatingParticle {
        constructor(initRandomY = false) {
            this.reset(initRandomY);
        }

        reset(initRandomY = false) {
            this.type = ["balloon", "heart", "sparkle", "petal"][Math.floor(Math.random() * 4)];
            this.x = Math.random() * globalCanvas.width;
            this.y = initRandomY ? (Math.random() * globalCanvas.height) : (globalCanvas.height + 50);
            this.size = Math.random() * 18 + 12; // Size slightly increased for better look
            this.speedY = -(Math.random() * 1.5 + 0.8);
            this.speedX = (Math.random() - 0.5) * 1.0;
            this.color = ["#ff6b9d", "#ffd700", "#a855f7", "#ff9f43", "#ff4d6d"][Math.floor(Math.random() * 5)];
            this.rotation = Math.random() * Math.PI * 2;
            this.rotSpeed = (Math.random() - 0.5) * 0.02;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotSpeed;
            if (this.y < -50) {
                this.reset(false);
            }
        }

        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillStyle = this.color;
            ctx.strokeStyle = this.color;

            if (this.type === "balloon") {
                ctx.beginPath();
                ctx.ellipse(0, 0, this.size * 0.8, this.size, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(-2, this.size);
                ctx.lineTo(2, this.size);
                ctx.lineTo(0, this.size + 4);
                ctx.closePath();
                ctx.fill();
            } else if (this.type === "heart") {
                ctx.beginPath();
                ctx.moveTo(0, -this.size / 4);
                ctx.bezierCurveTo(-this.size/2, -this.size/2, -this.size, 0, 0, this.size);
                ctx.bezierCurveTo(this.size, 0, this.size/2, -this.size/2, 0, -this.size/4);
                ctx.fill();
            } else if (this.type === "sparkle") {
                ctx.fillStyle = "#ffffff";
                ctx.beginPath();
                for (let i = 0; i < 4; i++) {
                    ctx.rotate(Math.PI / 2);
                    ctx.lineTo(0, this.size / 2);
                    ctx.lineTo(this.size / 8, 0);
                }
                ctx.fill();
            } else if (this.type === "petal") {
                ctx.beginPath();
                ctx.ellipse(0, 0, this.size * 0.4, this.size * 0.8, Math.PI / 4, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    class ConfettiParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 8 + 6;
            this.color = ["#ff007f", "#ff9f43", "#10ac84", "#2e86de", "#ffd200", "#a855f7"][Math.floor(Math.random() * 6)];
            this.vx = (Math.random() - 0.5) * 14;
            this.vy = (Math.random() - 0.85) * 18;
            this.gravity = 0.22;
            this.opacity = 1.0;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotSpeed = (Math.random() - 0.5) * 0.12;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += this.gravity;
            this.opacity -= 0.012;
            this.rotation += this.rotSpeed;
        }

        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
            ctx.restore();
        }
    }

    class FireworkParticle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 10;
            this.vy = (Math.random() - 0.5) * 10 - 1;
            this.color = color;
            this.gravity = 0.08;
            this.opacity = 1.0;
            this.size = Math.random() * 3 + 2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += this.gravity;
            this.opacity -= 0.014;
        }

        draw(ctx) {
            ctx.save();
            ctx.fillStyle = this.color;
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function initUnifiedEngine() {
        globalCanvas = document.getElementById("bgEffectsCanvas");
        if (!globalCanvas) return;
        
        globalCtx = globalCanvas.getContext("2d");

        function resize() {
            globalCanvas.width = window.innerWidth;
            globalCanvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener("resize", resize);

        // Initial Floating Particles Setup (Increased count to 70 for richer visuals)
        for (let i = 0; i < 70; i++) {
            bgParticles.push(new FloatingParticle(true));
        }

        function render() {
            globalCtx.clearRect(0, 0, globalCanvas.width, globalCanvas.height);

            // 1. Draw floating background animations (Balloons, Hearts, etc.)
            bgParticles.forEach(p => {
                p.update();
                p.draw(globalCtx);
            });

            // 2. Draw active confetti bursts
            for (let i = activeConfetti.length - 1; i >= 0; i--) {
                const p = activeConfetti[i];
                p.update();
                p.draw(globalCtx);
                if (p.opacity <= 0) {
                    activeConfetti.splice(i, 1);
                }
            }

            // 3. Draw active firework bursts
            for (let i = activeFireworks.length - 1; i >= 0; i--) {
                const f = activeFireworks[i];
                f.update();
                f.draw(globalCtx);
                if (f.opacity <= 0) {
                    activeFireworks.splice(i, 1);
                }
            }

            requestAnimationFrame(render);
        }
        render();
    }

    // --- LAUNCHERS ---

    function launchConfettiBlast() {
        if (!globalCanvas) return;
        
        const launchPoints = [
            { x: globalCanvas.width * 0.2, y: globalCanvas.height * 0.6 },
            { x: globalCanvas.width * 0.5, y: globalCanvas.height * 0.5 },
            { x: globalCanvas.width * 0.8, y: globalCanvas.height * 0.6 }
        ];

        launchPoints.forEach(pt => {
            for (let i = 0; i < 35; i++) {
                activeConfetti.push(new ConfettiParticle(pt.x, pt.y));
            }
        });
    }

    function launchFireworksShower() {
        if (!globalCanvas) return;
        
        const colors = ["#ff5252", "#ffd700", "#1dd1a1", "#0abde3", "#10ac84", "#a855f7"];
        for (let f = 0; f < 3; f++) {
            const x = Math.random() * globalCanvas.width;
            const y = Math.random() * (globalCanvas.height * 0.5);
            const color = colors[Math.floor(Math.random() * colors.length)];

            for (let i = 0; i < 45; i++) {
                activeFireworks.push(new FireworkParticle(x, y, color));
            }
        }
    }

    // --- INTERACTIVE BIRTHDAY CAKE DRAWING ---

    let candlesLit = 5;
    let isCakeCut = false;

    function initCake() {
        const canvas = document.getElementById("cakeCanvas");
        if (!canvas) return;
        
        const ctx = canvas.getContext("2d");

        function drawCake() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Stand / Plate
            ctx.fillStyle = "#e0e0e0";
            ctx.beginPath();
            ctx.ellipse(200, 310, 150, 45, 0, 0, Math.PI * 2);
            ctx.fill();

            // Tier Base Layer
            ctx.fillStyle = "#6f3e1b";
            ctx.fillRect(90, 200, 220, 90);

            // Tier Icing top
            ctx.fillStyle = "#ff85a2";
            ctx.fillRect(90, 180, 220, 20);

            // Layer Frosting Drops decoration
            ctx.fillStyle = "#ffd3e8";
            for (let i = 100; i < 300; i += 30) {
                ctx.beginPath();
                ctx.arc(i, 200, 12, 0, Math.PI);
                ctx.fill();
            }

            // Slice line
            if (isCakeCut) {
                ctx.strokeStyle = "#532b10";
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(200, 180);
                ctx.lineTo(200, 290);
                ctx.stroke();

                ctx.fillStyle = "#ff3366";
                ctx.font = "bold 16px sans-serif";
                ctx.fillText("🎂 Cut Finished!", 140, 370);
            }

            // Candles
            for (let i = 0; i < candlesLit; i++) {
                const x = 115 + (i * 40);
                const y = 135;

                // Wax Body
                ctx.fillStyle = "#a855f7";
                ctx.fillRect(x, y, 10, 45);

                // Lit Flame
                ctx.fillStyle = "#ff9f43";
                ctx.beginPath();
                ctx.ellipse(x + 5, y - 10, 6, 12, 0, 0, Math.PI * 2);
                ctx.fill();

                // Inner flame glow
                ctx.fillStyle = "#fff200";
                ctx.beginPath();
                ctx.ellipse(x + 5, y - 7, 4, 7, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        drawCake();

        const blowBtn = document.getElementById("blowCandlesBtn");
        if (blowBtn) {
            blowBtn.addEventListener("click", () => {
                if (candlesLit > 0) {
                    candlesLit--;
                    drawCake();
                    launchConfettiBlast();
                    if (candlesLit === 0) {
                        blowBtn.innerText = "✨ All Candles Blown!";
                    }
                }
            });
        }

        const cutBtn = document.getElementById("cutCakeBtn");
        if (cutBtn) {
            cutBtn.addEventListener("click", () => {
                isCakeCut = true;
                drawCake();
                launchConfettiBlast();
            });
        }
    }

    // Memory Gallery Load Setup
    function initGallery() {
        const gallery = document.getElementById("photoGallery");
        if (!gallery) return;
        
        const photos = [
            "couple.jpg",
            "photo5.png",
            "photo2.png",
            "photo3.png",
            "photo4.png",
	    "photo1.png"
        ];

        gallery.innerHTML = "";
        photos.forEach((url, i) => {
            const item = document.createElement("div");
            item.className = "photoItem";
            
            const img = document.createElement("img");
            img.src = url;
            img.alt = `Memory Frame ${i + 1}`;
            img.onerror = function() {
                this.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="%23333" width="200" height="200"/><text fill="%23fff" x="50%" y="50%" text-anchor="middle" dy=".3em">Image ' + (i+1) + '</text></svg>';
            };
            
            item.appendChild(img);
            gallery.appendChild(item);
        });
    }

    // Typewriter Special Letter Generator
    function startTypewriter() {
        const message = `For My Muthazhagu ❤️

Happy Birthday di pondati 🎂❤️

Unakku enna gift aah kudutha kooda podhathu, en manasula irukkuradha full aah express panna mudiyadhu. Aana indha website ah unakkaga create panni iruken, edhula oru small part aah en feelings aah vachiruken ana nee en feelings aah consider pannadhu illa but paravala

nee happy aah iruntha athu pothum. Namma rendu perum pesuna neram, sanda potta moments, siricha moments, random-ah pesina conversations idhellam enakku romba special. Sometimes namma rendu perukkum purinjukura sila vishayangal, vera yaarukkum puriyaadhu. 

Adhu dhaan namma relationship oda azhagu. ❤️ Naan perfect aah irukka maaten. En kitta mistakes irukkum, sometimes unnecessary aah kovapaduven, overthink pannuven, konjam torture kooda pannuven ,over possessive aaguven 😂. Aana oru vishayam mattum unmai  

unnai naan romba genuine aah care panren. Nee en life la vandhadhukku apram ordinary days kooda konjam special aah feel aachi yanaku. Un kooda pesuradhu, un reaction paakuradhu, unna tease pandrathu idhellam enakku romba pidicha things. 😌❤️

"Mama" nu naan irukken en  "pondati " nu nee irukka  namma rendu perukkum mattum therinja oru small world maari namma relationship irukku. Adha naan romba value panren.

Indha birthday la naan unakku wish panradhu simple:

Nee eppovume happy aah irukkanum.
Nee aasapadra yellam achieve pannanum.
Un smile eppovume irukkanum.
And whatever happens, namma memories eppovume special aah irukkanum. ❤️

Unakku indha website oru gift mattum illa di…

Idhu namma rendu peroda chinna memories ku oru small place. 

Once again and again 

Happy Birthday, pondati 💋💋💋💋💋💋💋💋💋💋💋💋💋💋💋💋💋💋💋💋🎂❤️

Love you di thangoooooooo💋💋💋💋💋💋💋💋💋💋💋💋💋💋💋💋💋💋💋💋💋💋💋💋.

— Un Mama ❤️‍🩹`;
        
        const container = document.getElementById("typewriterText");
        if (!container) return;
        
        let charIndex = 0;
        container.innerHTML = "";

        function type() {
            if (charIndex < message.length) {
                container.innerHTML += message.charAt(charIndex);
                charIndex++;
                setTimeout(type, 45); 
            }
        }
        type();
    }

    // Buttons
    const confettiBtn = document.getElementById("confettiBtn");
    const fireworksBtn = document.getElementById("fireworksBtn");
    const finalBtn = document.getElementById("triggerFinalScreenBtn");
    const restartBtn = document.getElementById("restartBtn");
    
    if (confettiBtn) confettiBtn.addEventListener("click", launchConfettiBlast);
    if (fireworksBtn) fireworksBtn.addEventListener("click", launchFireworksShower);

    if (finalBtn) {
        finalBtn.addEventListener("click", () => {
            const finalSurprise = document.getElementById("finalSurprise");
            if (finalSurprise) {
                finalSurprise.classList.add("active");
                launchFireworksShower();
            }
        });
    }

    if (restartBtn) {
        restartBtn.addEventListener("click", () => {
            const finalSurprise = document.getElementById("finalSurprise");
            if (finalSurprise) {
                finalSurprise.classList.remove("active");
            }
            candlesLit = 5;
            isCakeCut = false;
            const blowBtn = document.getElementById("blowCandlesBtn");
            if (blowBtn) blowBtn.innerText = "💨 Blow Candles";
            initCake();
        });
    }

    initUnifiedEngine();
});