/**
 * Interactive Rangoli Studio - Workflow Step 2
 * Sacred geometric mandala coloring with powder dust bursts, magic burst, and step unlock
 */

class RangoliStudio {
  constructor() {
    this.container = null;
    this.selectedColor = '#FB8500';
    this.coloredCount = 0;
    this.colorPalette = [
      { name: 'Saffron', hex: '#FB8500' },
      { name: 'Marigold', hex: '#FFB703' },
      { name: 'Gulal Pink', hex: '#D81159' },
      { name: 'Peacock Teal', hex: '#06D6A0' },
      { name: 'Sindoor Red', hex: '#E63946' },
      { name: 'Royal Indigo', hex: '#5E17EB' },
      { name: 'Gold Sparkle', hex: '#FFD700' },
      { name: 'Pure White', hex: '#FFFFFF' }
    ];
    this.paths = [];
  }

  init() {
    this.container = document.getElementById('step-rangoli-content');
    if (!this.container) return;

    this.render();
    this.attachEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="rangoli-workflow-wrap">
        <p class="step-guide-text">Pick a holy powder color & tap petals, or hit <strong>Magic Splash</strong> ✨</p>

        <!-- Color Palette Swatches -->
        <div id="rangoli-step-palette" class="rangoli-step-palette"></div>

        <!-- Sacred Rangoli SVG Mandala -->
        <div id="rangoli-step-svg-holder" class="rangoli-step-svg-holder"></div>

        <!-- Quick Actions -->
        <div class="rangoli-step-actions">
          <button id="rangoli-magic-burst-btn" class="action-btn-gold">
            <span>✨ Magic Splash Colors</span>
          </button>
          <button id="rangoli-step-reset-btn" class="action-btn-outline">
            <span>🔄 Reset</span>
          </button>
        </div>
      </div>
    `;

    this.renderPalette();
    this.renderMandala();
  }

  renderPalette() {
    const paletteEl = document.getElementById('rangoli-step-palette');
    if (!paletteEl) return;

    paletteEl.innerHTML = '';
    this.colorPalette.forEach((item, idx) => {
      const btn = document.createElement('button');
      btn.className = `color-powder-btn ${idx === 0 ? 'selected' : ''}`;
      btn.style.backgroundColor = item.hex;
      btn.title = item.name;
      btn.setAttribute('aria-label', `Select ${item.name}`);

      btn.addEventListener('click', () => {
        paletteEl.querySelectorAll('.color-powder-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.selectedColor = item.hex;
        window.diwaliAudio.playColorTap(idx);
        window.diwaliAudio.triggerHaptic(12);
      });

      paletteEl.appendChild(btn);
    });
  }

  renderMandala() {
    const holder = document.getElementById('rangoli-step-svg-holder');
    if (!holder) return;

    const size = 320;
    const center = size / 2;

    let svg = `<svg viewBox="0 0 ${size} ${size}" id="rangoli-step-svg" class="rangoli-step-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="rangoli-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <!-- Outer decorative circle -->
      <circle cx="${center}" cy="${center}" r="148" class="mandala-boundary" />
      <circle cx="${center}" cy="${center}" r="136" class="mandala-boundary-inner" />
    `;

    // Outer Petals (16 segments)
    const outerCount = 16;
    for (let i = 0; i < outerCount; i++) {
      const a1 = (i * 2 * Math.PI) / outerCount;
      const a2 = ((i + 1) * 2 * Math.PI) / outerCount;
      const mid = (a1 + a2) / 2;

      const x1 = center + 100 * Math.cos(a1);
      const y1 = center + 100 * Math.sin(a1);
      const x2 = center + 100 * Math.cos(a2);
      const y2 = center + 100 * Math.sin(a2);
      const tipX = center + 136 * Math.cos(mid);
      const tipY = center + 136 * Math.sin(mid);

      const d = `M ${x1} ${y1} Q ${tipX} ${tipY} ${x2} ${y2} Z`;
      svg += `<path d="${d}" class="mandala-petal outer-petal" data-group="outer" data-idx="${i}" fill="#24143a" />`;
    }

    // Mid Petals (8 segments)
    for (let i = 0; i < 8; i++) {
      const a1 = (i * 2 * Math.PI) / 8;
      const a2 = ((i + 1) * 2 * Math.PI) / 8;
      const mid = (a1 + a2) / 2;

      const x1 = center + 55 * Math.cos(a1);
      const y1 = center + 55 * Math.sin(a1);
      const x2 = center + 55 * Math.cos(a2);
      const y2 = center + 55 * Math.sin(a2);
      const tipX = center + 98 * Math.cos(mid);
      const tipY = center + 98 * Math.sin(mid);

      const d = `M ${x1} ${y1} Q ${tipX} ${tipY} ${x2} ${y2} Z`;
      svg += `<path d="${d}" class="mandala-petal mid-petal" data-group="mid" data-idx="${i}" fill="#190d2a" />`;
    }

    // Inner Lotus (8 segments)
    for (let i = 0; i < 8; i++) {
      const a1 = (i * 2 * Math.PI) / 8;
      const a2 = ((i + 1) * 2 * Math.PI) / 8;
      const mid = (a1 + a2) / 2;

      const x1 = center + 22 * Math.cos(a1);
      const y1 = center + 22 * Math.sin(a1);
      const x2 = center + 22 * Math.cos(a2);
      const y2 = center + 22 * Math.sin(a2);
      const tipX = center + 54 * Math.cos(mid);
      const tipY = center + 54 * Math.sin(mid);

      const d = `M ${x1} ${y1} Q ${tipX} ${tipY} ${x2} ${y2} Z`;
      svg += `<path d="${d}" class="mandala-petal inner-petal" data-group="inner" data-idx="${i}" fill="#2a1645" />`;
    }

    // Center Golden Diya Heart
    svg += `<circle cx="${center}" cy="${center}" r="22" class="mandala-petal center-core" data-group="core" fill="#ffd700" />`;
    svg += `<circle cx="${center}" cy="${center}" r="10" class="mandala-petal center-dot" data-group="dot" fill="#ff3864" />`;

    svg += `</svg>`;
    holder.innerHTML = svg;

    this.attachPetalListeners();
  }

  attachPetalListeners() {
    const petals = this.container.querySelectorAll('.mandala-petal');
    this.paths = Array.from(petals);

    this.paths.forEach((petal, idx) => {
      const applyColor = (e) => {
        if (e) e.preventDefault();
        petal.setAttribute('fill', this.selectedColor);
        petal.classList.remove('colored');
        void petal.offsetWidth;
        petal.classList.add('colored');

        this.coloredCount++;
        window.diwaliAudio.playColorTap(idx);
        window.diwaliAudio.triggerHaptic(15);

        // Unlock Step 2
        if (window.workflowManager) {
          window.workflowManager.unlockStep(2);
        }

        // Particle puff
        const rect = petal.getBoundingClientRect();
        if (window.diwaliParticles) {
          window.diwaliParticles.emitSparkler(rect.left + rect.width / 2, rect.top + rect.height / 2, 8);
        }
      };

      petal.addEventListener('click', applyColor);
      petal.addEventListener('touchstart', applyColor, { passive: false });
    });
  }

  attachEvents() {
    const magicBtn = document.getElementById('rangoli-magic-burst-btn');
    if (magicBtn) {
      magicBtn.addEventListener('click', () => this.autoMagicSplash());
    }

    const resetBtn = document.getElementById('rangoli-step-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.renderMandala();
        window.diwaliAudio.playBell(523.25);
      });
    }
  }

  autoMagicSplash() {
    const palette = ['#FB8500', '#FFB703', '#D81159', '#06D6A0', '#FFD700', '#E63946'];
    this.paths.forEach((petal, idx) => {
      setTimeout(() => {
        const group = petal.dataset.group;
        let c = palette[idx % palette.length];
        if (group === 'core') c = '#FFD700';
        if (group === 'dot') c = '#FFFFFF';

        petal.setAttribute('fill', c);
        petal.classList.add('colored');
        window.diwaliAudio.playColorTap(idx);
      }, idx * 40);
    });

    setTimeout(() => {
      window.diwaliAudio.playCelebrationFanfare();
      window.diwaliParticles.showerCelebration(35);
      if (window.workflowManager) {
        window.workflowManager.unlockStep(2);
      }
    }, this.paths.length * 40 + 100);
  }

  reset() {
    this.coloredCount = 0;
    this.render();
    this.attachEvents();
  }
}

window.rangoliStudio = new RangoliStudio();
