/**
 * Diya Lighting Ritual - Workflow Step 1
 * Grand central diya ignition with companion diyas, warm room illumination, and step unlock
 */

class DiyaCeremony {
  constructor() {
    this.container = null;
    this.isMainLit = false;
    this.litCompanionCount = 0;
    this.totalCompanions = 4;
  }

  init() {
    this.container = document.getElementById('step-diya-content');
    if (!this.container) return;

    this.render();
    this.attachEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="grand-diya-stage">
        <!-- Main Sacred Diya -->
        <div id="main-sacred-diya" class="main-diya-unit unlit" role="button" aria-label="Touch to kindle the sacred Diwali flame">
          <div class="flame-wrapper main-flame">
            <div class="flame-glow"></div>
            <div class="flame-body">
              <div class="flame-core"></div>
            </div>
            <div class="wick"></div>
          </div>
          <div class="clay-diya grand-clay-diya">
            <div class="diya-lip"></div>
            <div class="diya-rim">
              <span class="ornament-dot"></span>
              <span class="ornament-dot"></span>
              <span class="ornament-dot"></span>
              <span class="ornament-dot"></span>
              <span class="ornament-dot"></span>
            </div>
            <div class="diya-oil"></div>
            <div class="diya-base"></div>
          </div>
          <div class="diya-touch-badge pulse-touch">👆 Touch to kindle the sacred flame ✨</div>
        </div>

        <!-- Companion Diyas Row -->
        <div class="companion-diyas-row">
          <div class="companion-diya unlit" data-idx="0" title="Dharma Diya">
            <div class="flame-wrapper small-flame"><div class="flame-glow"></div><div class="flame-body"></div><div class="wick"></div></div>
            <div class="clay-diya mini-diya"><div class="diya-lip"></div><div class="diya-oil"></div></div>
            <span class="mini-label">Peace 🌿</span>
          </div>
          <div class="companion-diya unlit" data-idx="1" title="Jnana Diya">
            <div class="flame-wrapper small-flame"><div class="flame-glow"></div><div class="flame-body"></div><div class="wick"></div></div>
            <div class="clay-diya mini-diya"><div class="diya-lip"></div><div class="diya-oil"></div></div>
            <span class="mini-label">Wisdom 💡</span>
          </div>
          <div class="companion-diya unlit" data-idx="2" title="Samriddhi Diya">
            <div class="flame-wrapper small-flame"><div class="flame-glow"></div><div class="flame-body"></div><div class="wick"></div></div>
            <div class="clay-diya mini-diya"><div class="diya-lip"></div><div class="diya-oil"></div></div>
            <span class="mini-label">Prosperity 🪙</span>
          </div>
          <div class="companion-diya unlit" data-idx="3" title="Prema Diya">
            <div class="flame-wrapper small-flame"><div class="flame-glow"></div><div class="flame-body"></div><div class="wick"></div></div>
            <div class="clay-diya mini-diya"><div class="diya-lip"></div><div class="diya-oil"></div></div>
            <span class="mini-label">Love 💖</span>
          </div>
        </div>

        <!-- Auspicious Message Banner (Appears after lighting) -->
        <div id="diya-blessing-toast" class="step-blessing-toast">
          <span class="toast-om">🕉️</span>
          <p class="toast-quote">"असतो मा सद्गमय। तमसो मा ज्योतिर्गमय।"</p>
          <p class="toast-sub">May the divine light banish all darkness from your path!</p>
        </div>
      </div>
    `;
  }

  attachEvents() {
    const mainDiya = document.getElementById('main-sacred-diya');
    if (mainDiya) {
      const handleMainLight = (e) => {
        if (e) e.preventDefault();
        this.lightMainDiya();
      };
      mainDiya.addEventListener('click', handleMainLight);
      mainDiya.addEventListener('touchstart', handleMainLight, { passive: false });
    }

    const companions = this.container.querySelectorAll('.companion-diya');
    companions.forEach((comp, idx) => {
      comp.addEventListener('click', () => this.lightCompanion(comp, idx));
      comp.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.lightCompanion(comp, idx);
      }, { passive: false });
    });
  }

  lightMainDiya() {
    const mainDiya = document.getElementById('main-sacred-diya');
    if (!mainDiya || this.isMainLit) return;

    this.isMainLit = true;
    mainDiya.classList.remove('unlit');
    mainDiya.classList.add('lit');

    const badge = mainDiya.querySelector('.diya-touch-badge');
    if (badge) {
      badge.textContent = 'Sacred Flame Kindled! 🪔';
      badge.classList.remove('pulse-touch');
      badge.classList.add('lit-badge');
    }

    // Audio & Haptic response
    window.diwaliAudio.playDiyaLight(0);
    window.diwaliAudio.triggerHaptic([30, 40, 50]);

    // Burst golden sparks at flame tip
    const rect = mainDiya.getBoundingClientRect();
    window.diwaliParticles.emitSparkler(rect.left + rect.width / 2, rect.top + 30, 25);

    // Warm room glow shifts brighter
    const glowBackdrop = document.getElementById('ambient-room-glow');
    if (glowBackdrop) glowBackdrop.style.opacity = '0.55';

    // Show blessing quote
    const toast = document.getElementById('diya-blessing-toast');
    if (toast) toast.classList.add('visible');

    // Automatically light companion diyas in quick cascade
    const companions = this.container.querySelectorAll('.companion-diya');
    companions.forEach((comp, idx) => {
      setTimeout(() => {
        this.lightCompanion(comp, idx, true);
      }, (idx + 1) * 220);
    });

    // Notify WorkflowManager that Step 1 is complete!
    if (window.workflowManager) {
      window.workflowManager.unlockStep(1);
    }
  }

  lightCompanion(compEl, idx, auto = false) {
    if (!compEl || compEl.classList.contains('lit')) return;

    compEl.classList.remove('unlit');
    compEl.classList.add('lit');
    this.litCompanionCount++;

    if (!auto) {
      window.diwaliAudio.playDiyaLight(idx + 1);
      window.diwaliAudio.triggerHaptic(20);
      const rect = compEl.getBoundingClientRect();
      window.diwaliParticles.emitSparkler(rect.left + rect.width / 2, rect.top + 15, 12);
    }

    // If main was not lit yet, lighting companion also kindles main
    if (!this.isMainLit) {
      this.lightMainDiya();
    }
  }

  reset() {
    this.isMainLit = false;
    this.litCompanionCount = 0;
    this.render();
    this.attachEvents();
  }
}

window.diyaCeremony = new DiyaCeremony();
