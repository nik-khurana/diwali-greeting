/**
 * Personalized Greeting Card & Sharing - Workflow Step 5
 * Dynamic URL parsing, live card display, WhatsApp share, PNG image export, and customization drawer
 */

class GreetingCardEngine {
  constructor() {
    this.sender = 'Nikhil';
    this.recipient = 'You & Your Family';
    this.theme = 'theme-midnight-gold';
    this.wishText = 'May this auspicious festival of lights illuminate your journey with boundless joy, radiant health, and golden prosperity! Shubh Deepawali! 🪔✨';
    this.wishPresets = [
      'May this auspicious festival of lights illuminate your journey with boundless joy, radiant health, and golden prosperity! Shubh Deepawali! 🪔✨',
      'Wishing you a Diwali full of sparkling moments, a sky full of fireworks, a mouth full of sweets, and a heart full of love! 🎆🍬',
      'May Goddess Lakshmi bless your home with eternal abundance, and Lord Ganesha guide you towards triumph in every endeavor. Shubh Deepawali! 🪙🕉️',
      'May the warm glow of diyas fill your coming year with peace, laughter, and heartwarming memories. Happy Diwali! 🪔🌟'
    ];
  }

  init() {
    this.parseURLParams();
    this.render();
    this.bindEvents();
    this.updateCard();
  }

  parseURLParams() {
    const params = new URLSearchParams(window.location.search);
    const fromParam = params.get('from');
    const toParam = params.get('to');
    const wishParam = params.get('wish');
    const themeParam = params.get('theme');

    if (fromParam) this.sender = decodeURIComponent(fromParam);
    if (toParam) this.recipient = decodeURIComponent(toParam);
    if (wishParam) this.wishText = decodeURIComponent(wishParam);
    if (themeParam) this.theme = decodeURIComponent(themeParam);
  }

  render() {
    const container = document.getElementById('step-card-content');
    if (!container) return;

    container.innerHTML = `
      <div class="card-workflow-wrap">
        <!-- Live Greeting Card Mockup -->
        <div id="step-live-card" class="greeting-card-mockup ${this.theme}">
          <div class="card-ornament corner-top-left"></div>
          <div class="card-ornament corner-top-right"></div>
          <div class="card-ornament corner-bottom-left"></div>
          <div class="card-ornament corner-bottom-right"></div>
          
          <div class="card-diya-badge">🪔</div>
          <h3 class="card-festival-title">Shubh Deepawali</h3>
          <p class="card-to-line">Dearest ${this.recipient},</p>
          <p class="card-body-text">${this.wishText}</p>
          <div class="card-from-line">With Warmth & Light,<br>${this.sender}</div>
          <div class="card-footer-sparkle">✨ Happy Diwali 2026 ✨</div>
        </div>

        <!-- Share Actions -->
        <div class="card-share-buttons">
          <button id="card-share-whatsapp" class="share-btn-wa">
            <span>💬 Share on WhatsApp</span>
          </button>
          <button id="card-copy-link" class="share-btn-copy">
            <span>🔗 Copy Custom Link</span>
          </button>
          <button id="card-download-png" class="share-btn-download">
            <span>📥 Download Card (PNG)</span>
          </button>
        </div>

        <!-- Toggle to Customize Your Own Greeting -->
        <div class="customize-toggle-wrap">
          <button id="toggle-customize-drawer-btn" class="toggle-drawer-btn">
            <span>✍️ Personalize & Send to Your Friends ▼</span>
          </button>
          
          <div id="customize-card-drawer" class="customize-drawer collapsed">
            <div class="drawer-field">
              <label>Your Name (Sender):</label>
              <input type="text" id="edit-sender-name" value="${this.sender}" maxlength="35">
            </div>
            <div class="drawer-field">
              <label>Recipient Name:</label>
              <input type="text" id="edit-recipient-name" value="${this.recipient}" maxlength="35">
            </div>
            <div class="drawer-field">
              <label>Blessing Message:</label>
              <select id="edit-preset-select" class="festive-select">
                <option value="0">✨ Boundless Joy, Health & Golden Prosperity</option>
                <option value="1">🎆 Fireworks, Sweets & Heart Full of Love</option>
                <option value="2">🪙 Lakshmi Abundance & Ganesha Blessings</option>
                <option value="3">🪔 Warm Diya Glow & Peaceful Memories</option>
              </select>
            </div>
            <div class="drawer-field">
              <textarea id="edit-custom-wish" rows="2" maxlength="280">${this.wishText}</textarea>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // 1. WhatsApp share
    const waBtn = document.getElementById('card-share-whatsapp');
    if (waBtn) {
      waBtn.addEventListener('click', () => {
        const shareURL = this.generateShareURL();
        const text = `✨ *Happy Diwali!* ✨\n\n${this.wishText}\n\n🪔 *Open your interactive Diwali celebration here:* ${shareURL}`;
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
        window.diwaliAudio.playCelebrationFanfare();
      });
    }

    // 2. Copy Link
    const copyBtn = document.getElementById('card-copy-link');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const shareURL = this.generateShareURL();
        navigator.clipboard.writeText(shareURL).then(() => {
          this.showToast('✨ Link Copied! Send it to your loved ones!');
          window.diwaliAudio.playBell(784);
          window.diwaliParticles.showerCelebration(20);
        }).catch(() => {
          prompt('Copy this Diwali link:', shareURL);
        });
      });
    }

    // 3. Download PNG Image
    const dlBtn = document.getElementById('card-download-png');
    if (dlBtn) {
      dlBtn.addEventListener('click', () => this.exportCardAsImage());
    }

    // 4. Toggle Personalization Drawer
    const drawerBtn = document.getElementById('toggle-customize-drawer-btn');
    const drawer = document.getElementById('customize-card-drawer');
    if (drawerBtn && drawer) {
      drawerBtn.addEventListener('click', () => {
        const isCollapsed = drawer.classList.contains('collapsed');
        drawer.classList.toggle('collapsed', !isCollapsed);
        drawerBtn.textContent = isCollapsed ? '✍️ Close Personalize Drawer ▲' : '✍️ Personalize & Send to Your Friends ▼';
      });
    }

    // 5. Input Bindings
    const senderInp = document.getElementById('edit-sender-name');
    const recipInp = document.getElementById('edit-recipient-name');
    const presetSel = document.getElementById('edit-preset-select');
    const wishInp = document.getElementById('edit-custom-wish');

    if (senderInp) {
      senderInp.addEventListener('input', (e) => {
        this.sender = e.target.value.trim() || 'Well Wisher';
        this.updateCard();
      });
    }

    if (recipInp) {
      recipInp.addEventListener('input', (e) => {
        this.recipient = e.target.value.trim() || 'Dear Friend';
        this.updateCard();
      });
    }

    if (presetSel) {
      presetSel.addEventListener('change', (e) => {
        const idx = parseInt(e.target.value, 10);
        if (this.wishPresets[idx]) {
          this.wishText = this.wishPresets[idx];
          if (wishInp) wishInp.value = this.wishText;
          this.updateCard();
        }
      });
    }

    if (wishInp) {
      wishInp.addEventListener('input', (e) => {
        this.wishText = e.target.value.trim();
        this.updateCard();
      });
    }
  }

  updateCard() {
    const cardEl = document.getElementById('step-live-card');
    if (!cardEl) return;

    const toEl = cardEl.querySelector('.card-to-line');
    const bodyEl = cardEl.querySelector('.card-body-text');
    const fromEl = cardEl.querySelector('.card-from-line');

    if (toEl) toEl.textContent = `Dearest ${this.recipient},`;
    if (bodyEl) bodyEl.textContent = this.wishText;
    if (fromEl) fromEl.innerHTML = `With Warmth & Light,<br>${this.sender}`;
  }

  generateShareURL() {
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('from', this.sender);
    url.searchParams.set('to', this.recipient);
    url.searchParams.set('wish', this.wishText);
    return url.toString();
  }

  showToast(msg) {
    const toast = document.getElementById('global-toast');
    if (toast) {
      toast.textContent = msg;
      toast.classList.add('visible');
      setTimeout(() => toast.classList.remove('visible'), 2800);
    }
  }

  exportCardAsImage() {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');

    // Royal background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 1350);
    bgGrad.addColorStop(0, '#0a0815');
    bgGrad.addColorStop(0.5, '#1e1435');
    bgGrad.addColorStop(1, '#0a0815');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1350);

    // Golden borders
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 6;
    ctx.strokeRect(50, 50, 980, 1250);

    ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(65, 65, 950, 1220);

    // Title
    ctx.textAlign = 'center';
    ctx.font = 'bold 64px "Cinzel Decorative", Georgia, serif';
    ctx.fillStyle = '#ffd700';
    ctx.shadowColor = 'rgba(255, 215, 0, 0.6)';
    ctx.shadowBlur = 18;
    ctx.fillText('SHUBH DEEPAWALI', 540, 220);
    ctx.shadowBlur = 0;

    // Glowing Diya
    ctx.font = '72px sans-serif';
    ctx.fillText('🪔', 540, 340);

    // Recipient
    ctx.font = 'italic 46px "Poppins", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Dearest ${this.recipient},`, 540, 480);

    // Message
    ctx.font = '36px "Poppins", sans-serif';
    ctx.fillStyle = '#fceabb';
    const maxWidth = 800;
    const lineHeight = 55;
    const words = this.wishText.split(' ');
    let line = '';
    let y = 580;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, 540, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 540, y);

    // Sign-off
    ctx.font = 'italic 36px "Poppins", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('With warmth, love & blessings,', 540, 980);

    ctx.font = 'bold 50px "Cinzel Decorative", Georgia, serif';
    ctx.fillStyle = '#ffd700';
    ctx.fillText(this.sender, 540, 1050);

    // Tag
    ctx.font = '28px "Poppins", sans-serif';
    ctx.fillStyle = 'rgba(255, 215, 0, 0.7)';
    ctx.fillText('✨ May the divine light shine upon you ✨', 540, 1200);

    // Download
    const link = document.createElement('a');
    link.download = `diwali-greeting-${this.sender.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    this.showToast('📥 Greeting Card Downloaded!');
    window.diwaliAudio.playCelebrationFanfare();
    window.diwaliParticles.showerCelebration(40);
  }

  onEnter() {
    window.diwaliAudio.playCelebrationFanfare();
    window.diwaliParticles.showerCelebration(55);
  }
}

window.greetingCardEngine = new GreetingCardEngine();
