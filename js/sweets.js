/**
 * Diwali Mithai Feast - Workflow Step 3
 * Interactive sweet platter with bite physics, sound feedback, calorie-free blessings, and step unlock
 */

class MithaiFeast {
  constructor() {
    this.container = null;
    this.bitesCount = 0;
    this.sweetsData = [
      {
        id: 'kaju-katli',
        name: 'Kaju Katli',
        sub: 'Silver Vark Cashew Diamond',
        color: '#ebebeb',
        accent: '#c0c0c0',
        shape: 'diamond',
        bites: 0,
        quote: 'Shine as radiant as silver foil this Diwali! 💎'
      },
      {
        id: 'gulab-jamun',
        name: 'Gulab Jamun',
        sub: 'Cardamom & Saffron Nectar',
        color: '#5e2509',
        accent: '#8d3b10',
        shape: 'sphere',
        bites: 0,
        quote: 'May your life be dipped in eternal sweetness! 🍯'
      },
      {
        id: 'motichoor-laddu',
        name: 'Motichoor Laddu',
        sub: 'Golden Ghee Pearls',
        color: '#ff9500',
        accent: '#e07a00',
        shape: 'textured-sphere',
        bites: 0,
        quote: 'Auspicious beginnings blessed by Ganesha! 🐘'
      },
      {
        id: 'jalebi',
        name: 'Crispy Jalebi',
        sub: 'Saffron Swirls',
        color: '#ff7700',
        accent: '#ffaa00',
        shape: 'spiral',
        bites: 0,
        quote: 'Life may have twists, but may it always stay sweet! 🌀'
      }
    ];
  }

  init() {
    this.container = document.getElementById('step-sweets-content');
    if (!this.container) return;

    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="sweets-workflow-wrap">
        <p class="step-guide-text">Every celebration needs sweetness! Tap any sweet to take a bite 😋</p>

        <!-- Brass Thali -->
        <div class="step-thali-plate">
          <div id="sweets-step-grid" class="sweets-step-grid"></div>
        </div>

        <!-- Sweet Quote Bubble -->
        <div id="step-sweet-bubble" class="step-sweet-bubble">100% Love, 0% Calories! 🍬</div>
      </div>
    `;

    this.renderSweets();
  }

  renderSweets() {
    const grid = document.getElementById('sweets-step-grid');
    if (!grid) return;

    grid.innerHTML = '';
    this.sweetsData.forEach((sweet) => {
      sweet.bites = 0;
      const card = document.createElement('div');
      card.className = 'step-sweet-card';
      card.dataset.id = sweet.id;

      card.innerHTML = `
        <div class="sweet-visual-wrap" id="visual-${sweet.id}">
          ${this.getSweetSvg(sweet)}
        </div>
        <div class="step-sweet-label">
          <strong>${sweet.name}</strong>
          <span>${sweet.sub}</span>
        </div>
        <span class="taste-pill">Tap to taste 🍴</span>
      `;

      card.addEventListener('click', () => this.takeBite(sweet, card));
      card.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.takeBite(sweet, card);
      }, { passive: false });

      grid.appendChild(card);
    });
  }

  getSweetSvg(sweet) {
    switch (sweet.shape) {
      case 'diamond':
        return `
          <svg viewBox="0 0 100 100" class="sweet-svg">
            <defs>
              <linearGradient id="vark-foil-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
                <stop offset="50%" stop-color="#c5c5c5" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#ffffff" stop-opacity="0.95" />
              </linearGradient>
            </defs>
            <polygon points="50,10 90,50 50,90 10,50" fill="${sweet.color}" stroke="${sweet.accent}" stroke-width="2" />
            <polygon points="45,15 85,50 45,85 15,50" fill="url(#vark-foil-grad)" />
          </svg>
        `;
      case 'sphere':
        return `
          <svg viewBox="0 0 100 100" class="sweet-svg">
            <circle cx="50" cy="50" r="38" fill="${sweet.color}" />
            <circle cx="42" cy="40" r="14" fill="#a44816" opacity="0.45" />
            <rect x="52" y="38" width="6" height="3" rx="1.5" fill="#4d8b31" transform="rotate(30 52 38)" />
            <rect x="46" y="52" width="7" height="3" rx="1.5" fill="#4d8b31" transform="rotate(-20 46 52)" />
          </svg>
        `;
      case 'textured-sphere':
        return `
          <svg viewBox="0 0 100 100" class="sweet-svg">
            <circle cx="50" cy="50" r="38" fill="${sweet.color}" />
            <circle cx="42" cy="36" r="5" fill="#ffd000" />
            <circle cx="56" cy="40" r="6" fill="#e07a00" />
            <circle cx="48" cy="52" r="5" fill="#ffd000" />
            <polygon points="46,34 52,38 48,44 42,40" fill="#ffffff" opacity="0.75" />
          </svg>
        `;
      case 'spiral':
      default:
        return `
          <svg viewBox="0 0 100 100" class="sweet-svg">
            <path d="M 50,50 m -15,0 a 15,15 0 1,0 30,0 a 15,15 0 1,0 -30,0 M 50,50 m -25,0 a 25,25 0 1,0 50,0 a 25,25 0 1,0 -50,0" fill="none" stroke="${sweet.color}" stroke-width="7" stroke-linecap="round" />
            <path d="M 48,48 m -15,0 a 15,15 0 1,0 30,0" fill="none" stroke="${sweet.accent}" stroke-width="3" stroke-linecap="round" opacity="0.8" />
          </svg>
        `;
    }
  }

  takeBite(sweet, cardEl) {
    sweet.bites++;
    this.bitesCount++;

    window.diwaliAudio.playBite();
    window.diwaliAudio.triggerHaptic(20);

    const visualWrap = cardEl.querySelector('.sweet-visual-wrap');
    if (visualWrap) {
      visualWrap.classList.remove('bite-1', 'bite-2');
      visualWrap.classList.add(`bite-${Math.min(2, sweet.bites)}`);
    }

    const pill = cardEl.querySelector('.taste-pill');
    if (pill) {
      pill.textContent = sweet.bites >= 2 ? 'Finished! 🌟' : 'Tasty! Nom 😋';
    }

    // Show floating bubble message
    this.showToast(sweet.quote);

    // Confetti sparks
    if (window.diwaliParticles) {
      const rect = cardEl.getBoundingClientRect();
      window.diwaliParticles.emitSparkler(rect.left + rect.width / 2, rect.top + 30, 10);
    }

    // Unlock Step 3 in workflow
    if (window.workflowManager) {
      window.workflowManager.unlockStep(3);
    }
  }

  showToast(msg) {
    const bubble = document.getElementById('step-sweet-bubble');
    if (bubble) {
      bubble.textContent = msg;
      bubble.classList.add('visible');
      clearTimeout(this.bubbleTimer);
      this.bubbleTimer = setTimeout(() => {
        bubble.classList.remove('visible');
      }, 2400);
    }
  }

  reset() {
    this.bitesCount = 0;
    this.render();
  }
}

window.mithaiFeast = new MithaiFeast();
