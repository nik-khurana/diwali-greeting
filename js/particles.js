/**
 * Diwali Particle Engine
 * High-performance 60fps canvas particle system optimized for mobile
 *
 * Layering Architecture:
 * - Background Canvas (z-index: 2, behind UI):
 *     1. Ambient golden floating bokeh embers & twinkling stars
 *     2. Automatic ambient background fireworks & rockets burning in the distant night sky!
 * - Foreground Canvas (z-index: 30, in front of UI, pointer-events: none):
 *     1. Crisp user-interactive sparklers (phooljhadi), anars, chakris, rockets, and petal confetti
 */

class ParticleEngine {
  constructor() {
    this.bgCanvas = null;
    this.bgCtx = null;
    this.crackerCanvas = null;
    this.crackerCtx = null;

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Particle pools
    this.ambientParticles = [];
    this.bgRockets = [];
    this.bgCrackers = [];
    this.crackerParticles = [];
    this.confettiParticles = [];
    this.activeEmitters = [];

    // Background ambient crackers state
    this.enableAmbientCrackers = true;
    this.ambientTimer = null;

    this.isRunning = false;
    this.lastTime = performance.now();
  }

  init(bgCanvasId = 'bg-canvas', crackerCanvasId = 'cracker-canvas') {
    this.bgCanvas = document.getElementById(bgCanvasId);
    this.crackerCanvas = document.getElementById(crackerCanvasId);

    if (this.bgCanvas) this.bgCtx = this.bgCanvas.getContext('2d');
    if (this.crackerCanvas) this.crackerCtx = this.crackerCanvas.getContext('2d');

    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    // Seed ambient golden embers
    this.initAmbientEmbers();

    // Start continuous background fireworks loop
    this.scheduleNextAmbientBurst(1500);

    // Listen for taps on empty space to launch background sky fireworks
    window.addEventListener('click', (e) => {
      // If click was directly on main or section background (not interactive buttons or inputs)
      const target = e.target;
      if (target.classList && (target.classList.contains('main-content-flow') || target.classList.contains('interaction-section') || target.classList.contains('app-viewport'))) {
        this.launchBackgroundRocket(e.clientX, e.clientY);
      }
    }, { passive: true });

    this.isRunning = true;
    requestAnimationFrame((t) => this.loop(t));
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    if (this.bgCanvas && this.bgCtx) {
      this.bgCanvas.width = this.width * this.dpr;
      this.bgCanvas.height = this.height * this.dpr;
      this.bgCtx.scale(this.dpr, this.dpr);
    }

    if (this.crackerCanvas && this.crackerCtx) {
      this.crackerCanvas.width = this.width * this.dpr;
      this.crackerCanvas.height = this.height * this.dpr;
      this.crackerCtx.scale(this.dpr, this.dpr);
    }
  }

  initAmbientEmbers() {
    const count = Math.min(35, Math.floor(this.width / 18));
    this.ambientParticles = [];
    for (let i = 0; i < count; i++) {
      this.ambientParticles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: 1 + Math.random() * 2.2,
        speedY: 0.18 + Math.random() * 0.45,
        speedX: (Math.random() - 0.5) * 0.25,
        opacity: 0.12 + Math.random() * 0.6,
        pulseSpeed: 0.01 + Math.random() * 0.02,
        color: Math.random() > 0.4 ? '#ffd700' : (Math.random() > 0.5 ? '#ff9900' : '#ffefaa')
      });
    }
  }

  // --- AMBIENT BACKGROUND CRACKERS & SKY FIREWORKS ---

  toggleAmbientCrackers() {
    this.enableAmbientCrackers = !this.enableAmbientCrackers;
    if (this.enableAmbientCrackers) {
      this.scheduleNextAmbientBurst(800);
    } else {
      if (this.ambientTimer) clearTimeout(this.ambientTimer);
    }
    return this.enableAmbientCrackers;
  }

  scheduleNextAmbientBurst(delay = null) {
    if (!this.enableAmbientCrackers) return;
    const nextDelay = delay !== null ? delay : 2200 + Math.random() * 2600;

    this.ambientTimer = setTimeout(() => {
      if (!this.enableAmbientCrackers) return;

      const rx = this.width * 0.1 + Math.random() * (this.width * 0.8);
      const ry = this.height * 0.1 + Math.random() * (this.height * 0.35);
      this.launchBackgroundRocket(rx, ry);

      // Occasionally launch a second rocket for double-burst spectacle
      if (Math.random() > 0.65) {
        setTimeout(() => {
          if (!this.enableAmbientCrackers) return;
          const rx2 = this.width * 0.15 + Math.random() * (this.width * 0.7);
          const ry2 = this.height * 0.08 + Math.random() * (this.height * 0.32);
          this.launchBackgroundRocket(rx2, ry2);
        }, 350 + Math.random() * 450);
      }

      this.scheduleNextAmbientBurst();
    }, nextDelay);
  }

  launchBackgroundRocket(targetX, targetY) {
    const startY = this.height + 20;
    const rocket = {
      x: targetX + (Math.random() - 0.5) * 30,
      y: startY,
      targetY: targetY,
      vx: (targetX - targetX) * 0.02,
      vy: -(8.5 + Math.random() * 3.5),
      color: '#ffd700',
      trail: []
    };
    this.bgRockets.push(rocket);
  }

  burstBackgroundRocket(x, y) {
    const count = 48 + Math.floor(Math.random() * 32);
    const palettes = [
      ['#ff0055', '#ff9900', '#ffd700', '#ffffff'], // Gold & Fire
      ['#00f0ff', '#7000ff', '#ff00aa', '#ffffff'], // Cyber Peacock
      ['#39ff14', '#00e5ff', '#ffff00', '#ffffff'], // Neon Emerald
      ['#ff4d6d', '#ffb703', '#ffffff', '#ffd166']  // Marigold Coral
    ];
    const palette = palettes[Math.floor(Math.random() * palettes.length)];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.22;
      const speed = 1.2 + Math.random() * 4.2;
      this.bgCrackers.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 0.95,
        decay: 0.012 + Math.random() * 0.014,
        size: 1.2 + Math.random() * 1.9,
        color: palette[Math.floor(Math.random() * palette.length)],
        gravity: 0.05,
        shimmer: Math.random() > 0.4
      });
    }

    // Gentle distant boom sound effect
    if (window.diwaliAudio && !window.diwaliAudio.isMuted) {
      window.diwaliAudio.playDistantBoom();
    }
  }

  // --- FOREGROUND CRACKER EMITTERS (Interactive) ---

  // 1. Phooljhadi / Sparkler: Trail of sparks following finger/pointer
  emitSparkler(x, y, count = 14) {
    const colors = ['#fff7cc', '#ffd700', '#ff9f1c', '#ff3864', '#ffffff', '#2ec4b6'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.8 + Math.random() * 6.5;
      const life = 22 + Math.random() * 30;
      this.crackerParticles.push({
        type: 'sparkler',
        x: x + (Math.random() - 0.5) * 6,
        y: y + (Math.random() - 0.5) * 6,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        decay: 1 / life,
        alpha: 1,
        size: 1.4 + Math.random() * 2.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        gravity: 0.14
      });
    }
  }

  // 2. Anar (Flowerpot Fountain)
  startAnar(x, y, durationMs = 2800) {
    const emitter = {
      type: 'anar',
      x: x,
      y: y,
      startTime: performance.now(),
      duration: durationMs,
      update: (now) => {
        const elapsed = now - emitter.startTime;
        if (elapsed > emitter.duration) return false;

        const progress = elapsed / emitter.duration;
        const currentIntensity = progress < 0.2 ? progress / 0.2 : (progress > 0.8 ? (1 - progress) / 0.2 : 1);
        const spawnCount = Math.floor(currentIntensity * 15) + 3;

        const colors = ['#ffffff', '#fff275', '#ffd700', '#ff8c00', '#ff3e3e', '#70e000'];
        for (let i = 0; i < spawnCount; i++) {
          const spreadAngle = (Math.PI / 2) + (Math.random() - 0.5) * 0.75;
          const speed = (6.5 + Math.random() * 11) * currentIntensity;
          this.crackerParticles.push({
            type: 'anarSpark',
            x: emitter.x + (Math.random() - 0.5) * 10,
            y: emitter.y,
            vx: -Math.cos(spreadAngle) * speed,
            vy: -Math.sin(spreadAngle) * speed,
            alpha: 1,
            decay: 0.02 + Math.random() * 0.025,
            size: 1.6 + Math.random() * 2.6,
            color: colors[Math.floor(Math.random() * colors.length)],
            gravity: 0.28
          });
        }
        return true;
      }
    };
    this.activeEmitters.push(emitter);
  }

  // 3. Chakri (Ground Spinner)
  startChakri(x, y, durationMs = 3200) {
    const emitter = {
      type: 'chakri',
      x: x,
      y: y,
      startTime: performance.now(),
      duration: durationMs,
      rotation: 0,
      spinSpeed: 0.35,
      update: (now) => {
        const elapsed = now - emitter.startTime;
        if (elapsed > emitter.duration) return false;

        const progress = elapsed / emitter.duration;
        const currentIntensity = progress > 0.85 ? (1 - progress) / 0.15 : 1;
        emitter.rotation += emitter.spinSpeed * currentIntensity;

        const arms = 3;
        const colors = ['#ffd700', '#ff6b35', '#00f5d4', '#f72585', '#fff3b0'];
        for (let a = 0; a < arms; a++) {
          const baseAngle = emitter.rotation + (a * (Math.PI * 2 / arms));
          for (let p = 0; p < 3; p++) {
            const angle = baseAngle + (Math.random() - 0.5) * 0.25;
            const speed = (3.5 + Math.random() * 6.5) * currentIntensity;
            this.crackerParticles.push({
              type: 'chakriSpark',
              x: emitter.x,
              y: emitter.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed * 0.65,
              alpha: 1,
              decay: 0.025 + Math.random() * 0.02,
              size: 1.5 + Math.random() * 2.2,
              color: colors[(a + Math.floor(Math.random() * 2)) % colors.length],
              gravity: 0.05
            });
          }
        }
        return true;
      }
    };
    this.activeEmitters.push(emitter);
  }

  // 4. Aerial Firework Burst (Foreground Interactive)
  burstRocket(x, y) {
    const count = 75 + Math.floor(Math.random() * 45);
    const paletteCollection = [
      ['#ff0055', '#ff9900', '#ffd700', '#ffffff'],
      ['#00f0ff', '#7000ff', '#ff00aa', '#ffffff'],
      ['#39ff14', '#00e5ff', '#ffff00', '#ffffff'],
      ['#ff007f', '#ffffff', '#ffaa00', '#ffe600']
    ];
    const palette = paletteCollection[Math.floor(Math.random() * paletteCollection.length)];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.15;
      const speed = 2.5 + Math.random() * 6.8;
      this.crackerParticles.push({
        type: 'firework',
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        decay: 0.012 + Math.random() * 0.015,
        size: 2.0 + Math.random() * 2.4,
        color: palette[Math.floor(Math.random() * palette.length)],
        gravity: 0.08,
        shimmer: Math.random() > 0.4
      });
    }

    // Flash ring
    this.crackerParticles.push({
      type: 'ring',
      x: x,
      y: y,
      radius: 6,
      maxRadius: 75,
      alpha: 0.95,
      decay: 0.065,
      color: palette[0]
    });
  }

  // 5. Celebration Flower Petal Confetti
  showerCelebration(count = 60) {
    const petalColors = ['#ff7b00', '#ffaa00', '#ffd000', '#d90429', '#ef233c', '#ffffff'];
    for (let i = 0; i < count; i++) {
      this.confettiParticles.push({
        x: Math.random() * this.width,
        y: -20 - Math.random() * 100,
        vx: (Math.random() - 0.5) * 2.5,
        vy: 2 + Math.random() * 3.5,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 6,
        size: 7 + Math.random() * 9,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        alpha: 1,
        wobble: Math.random() * 10,
        wobbleSpeed: 0.05 + Math.random() * 0.05
      });
    }
  }

  // --- RENDER & UPDATE LOOP ---
  loop(time) {
    if (!this.isRunning) return;

    // ==========================================
    // 1. BACKGROUND CANVAS (z-index: 2, behind UI)
    // ==========================================
    if (this.bgCtx) {
      this.bgCtx.clearRect(0, 0, this.width, this.height);

      // A. Ambient Golden Floating Bokeh Embers
      for (const p of this.ambientParticles) {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.opacity += Math.sin(time * p.pulseSpeed) * 0.005;
        p.opacity = Math.max(0.08, Math.min(0.8, p.opacity));

        if (p.y < -10) {
          p.y = this.height + 10;
          p.x = Math.random() * this.width;
        }
        if (p.x < -10) p.x = this.width + 10;
        if (p.x > this.width + 10) p.x = -10;

        this.bgCtx.save();
        this.bgCtx.globalAlpha = p.opacity;
        this.bgCtx.fillStyle = p.color;
        this.bgCtx.shadowBlur = 8;
        this.bgCtx.shadowColor = p.color;
        this.bgCtx.beginPath();
        this.bgCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.bgCtx.fill();
        this.bgCtx.restore();
      }

      // B. Background Ascending Sky Rockets
      for (let i = this.bgRockets.length - 1; i >= 0; i--) {
        const r = this.bgRockets[i];
        r.y += r.vy;
        r.x += r.vx;

        // Spark trail behind rocket
        r.trail.push({ x: r.x, y: r.y, alpha: 0.8 });
        if (r.trail.length > 8) r.trail.shift();

        // Draw rocket head & spark trail
        this.bgCtx.save();
        for (const t of r.trail) {
          this.bgCtx.globalAlpha = t.alpha;
          this.bgCtx.fillStyle = '#ffd700';
          this.bgCtx.shadowBlur = 6;
          this.bgCtx.shadowColor = '#ff9500';
          this.bgCtx.fillRect(t.x - 1, t.y, 2.5, 4);
          t.alpha -= 0.1;
        }
        this.bgCtx.restore();

        // Check if rocket reached its explosion altitude
        if (r.y <= r.targetY || r.vy >= 0) {
          this.burstBackgroundRocket(r.x, r.targetY);
          this.bgRockets.splice(i, 1);
        }
      }

      // C. Background Burst Particles
      for (let i = this.bgCrackers.length - 1; i >= 0; i--) {
        const p = this.bgCrackers[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          this.bgCrackers.splice(i, 1);
          continue;
        }

        const renderAlpha = p.shimmer && Math.random() > 0.5 ? p.alpha * 0.4 : p.alpha;
        this.bgCtx.save();
        this.bgCtx.globalAlpha = Math.max(0, renderAlpha);
        this.bgCtx.fillStyle = p.color;
        this.bgCtx.shadowBlur = 6;
        this.bgCtx.shadowColor = p.color;
        this.bgCtx.beginPath();
        this.bgCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.bgCtx.fill();
        this.bgCtx.restore();
      }
    }

    // ==========================================
    // 2. FOREGROUND CANVAS (z-index: 30, in front of UI)
    // ==========================================
    if (this.crackerCtx) {
      // Fade previous particle trails smoothly using destination-out to keep transparent
      if (this.crackerParticles.length === 0 && this.activeEmitters.length === 0 && this.confettiParticles.length === 0) {
        this.crackerCtx.clearRect(0, 0, this.width, this.height);
      } else {
        this.crackerCtx.save();
        this.crackerCtx.globalCompositeOperation = 'destination-out';
        this.crackerCtx.fillStyle = 'rgba(0, 0, 0, 0.22)';
        this.crackerCtx.fillRect(0, 0, this.width, this.height);
        this.crackerCtx.restore();
      }

      // Update active continuous emitters (Anar, Chakri)
      this.activeEmitters = this.activeEmitters.filter(em => em.update(time));

      // Draw interactive cracker sparks with glowing additive blend
      this.crackerCtx.save();
      this.crackerCtx.globalCompositeOperation = 'lighter';

      for (let i = this.crackerParticles.length - 1; i >= 0; i--) {
        const p = this.crackerParticles[i];

        if (p.type === 'ring') {
          p.radius += 3.6;
          p.alpha -= p.decay;
          if (p.alpha <= 0 || p.radius >= p.maxRadius) {
            this.crackerParticles.splice(i, 1);
            continue;
          }
          this.crackerCtx.save();
          this.crackerCtx.globalAlpha = p.alpha;
          this.crackerCtx.strokeStyle = p.color;
          this.crackerCtx.lineWidth = 2.5;
          this.crackerCtx.shadowBlur = 12;
          this.crackerCtx.shadowColor = p.color;
          this.crackerCtx.beginPath();
          this.crackerCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          this.crackerCtx.stroke();
          this.crackerCtx.restore();
          continue;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity || 0.1;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          this.crackerParticles.splice(i, 1);
          continue;
        }

        const renderAlpha = p.shimmer && Math.random() > 0.5 ? p.alpha * 0.4 : p.alpha;

        this.crackerCtx.save();
        this.crackerCtx.globalAlpha = Math.max(0, renderAlpha);
        this.crackerCtx.fillStyle = p.color;
        this.crackerCtx.shadowBlur = 10;
        this.crackerCtx.shadowColor = p.color;
        this.crackerCtx.beginPath();
        this.crackerCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.crackerCtx.fill();
        this.crackerCtx.restore();
      }
      this.crackerCtx.restore();

      // Update & draw Confetti Petals
      for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
        const c = this.confettiParticles[i];
        c.y += c.vy;
        c.wobble += c.wobbleSpeed;
        c.x += c.vx + Math.sin(c.wobble) * 1.5;
        c.rotation += c.rotSpeed;

        if (c.y > this.height + 40) {
          this.confettiParticles.splice(i, 1);
          continue;
        }

        this.crackerCtx.save();
        this.crackerCtx.translate(c.x, c.y);
        this.crackerCtx.rotate((c.rotation * Math.PI) / 180);
        this.crackerCtx.fillStyle = c.color;
        this.crackerCtx.globalAlpha = 0.92;
        this.crackerCtx.shadowBlur = 6;
        this.crackerCtx.shadowColor = c.color;

        // Petal shape (elongated teardrop / oval)
        this.crackerCtx.beginPath();
        this.crackerCtx.ellipse(0, 0, c.size, c.size * 0.55, 0, 0, Math.PI * 2);
        this.crackerCtx.fill();
        this.crackerCtx.restore();
      }
    }

    requestAnimationFrame((t) => this.loop(t));
  }
}

// Global instance
window.diwaliParticles = new ParticleEngine();
