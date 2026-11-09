/**
 * Fireworks & Sparkler Arena - Workflow Step 4
 * Interactive touch sparkler drawing, aerial rocket bursts, finale show, and step unlock
 */

class CrackerPlayground {
  constructor() {
    this.container = null;
    this.sparklerWand = null;
    this.isDragging = false;
    this.hasInteracted = false;
  }

  init() {
    this.container = document.getElementById('step-cracker-stage');
    this.sparklerWand = document.getElementById('sparkler-cursor');
    if (!this.container) return;

    this.attachEvents();
  }

  attachEvents() {
    const stage = this.container;

    const getPos = (e) => {
      const rect = stage.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX,
        y: clientY,
        stageX: clientX - rect.left,
        stageY: clientY - rect.top
      };
    };

    const onStart = (e) => {
      this.isDragging = true;
      const pos = getPos(e);
      this.triggerSparkle(pos.x, pos.y);
      this.markInteracted();
    };

    const onMove = (e) => {
      const pos = getPos(e);
      if (this.sparklerWand) {
        this.sparklerWand.style.opacity = '1';
        this.sparklerWand.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      }

      if (this.isDragging) {
        this.triggerSparkle(pos.x, pos.y);
      }
    };

    const onEnd = () => {
      this.isDragging = false;
    };

    stage.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseup', onEnd);

    stage.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd, { passive: true });

    // Rocket burst button
    const burstBtn = document.getElementById('launch-sky-rocket-btn');
    if (burstBtn) {
      burstBtn.addEventListener('click', () => {
        const rect = stage.getBoundingClientRect();
        const rx = rect.left + rect.width * (0.2 + Math.random() * 0.6);
        const ry = rect.top + rect.height * (0.2 + Math.random() * 0.4);
        this.launchRocket(rx, ry);
        this.markInteracted();
      });
    }

    // Finale button
    const finaleBtn = document.getElementById('burst-finale-btn');
    if (finaleBtn) {
      finaleBtn.addEventListener('click', () => {
        this.triggerFinale();
        this.markInteracted();
      });
    }
  }

  triggerSparkle(x, y) {
    if (window.diwaliParticles) {
      window.diwaliParticles.emitSparkler(x, y, 16);
    }
    if (Math.random() > 0.45 && window.diwaliAudio) {
      window.diwaliAudio.playSparklerCrackle();
    }
  }

  launchRocket(targetX, targetY) {
    if (window.diwaliAudio) {
      window.diwaliAudio.playFirework();
      window.diwaliAudio.triggerHaptic(30);
    }

    if (window.diwaliParticles) {
      setTimeout(() => {
        window.diwaliParticles.burstRocket(targetX, targetY);
      }, 440);
    }
  }

  triggerFinale() {
    const rect = this.container.getBoundingClientRect();
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const rx = rect.left + rect.width * (0.15 + Math.random() * 0.7);
        const ry = rect.top + rect.height * (0.15 + Math.random() * 0.5);
        this.launchRocket(rx, ry);
      }, i * 380);
    }
    setTimeout(() => {
      if (window.diwaliParticles) {
        window.diwaliParticles.showerCelebration(45);
      }
    }, 2400);
  }

  markInteracted() {
    if (!this.hasInteracted) {
      this.hasInteracted = true;
      if (window.workflowManager) {
        window.workflowManager.unlockStep(4);
      }
    }
  }

  reset() {
    this.hasInteracted = false;
  }
}

window.crackerPlayground = new CrackerPlayground();
