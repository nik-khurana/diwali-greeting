/**
 * Diwali Celebration App - Single Interactive Workflow Orchestrator
 * Controls the 5 progressive steps: Diya -> Rangoli -> Sweets -> Crackers -> Blessing Card
 */

class WorkflowManager {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 5;
    this.unlockedSteps = new Set([1]);

    this.stepNextTexts = {
      1: 'Next: Adorn Rangoli ➔',
      2: 'Next: Taste Mithai ➔',
      3: 'Next: Spark Crackers ➔',
      4: 'Next: Reveal Blessing ➔',
      5: '🔄 Relive Celebration'
    };

    this.touchStartX = 0;
    this.touchStartY = 0;
  }

  init() {
    this.bindNavigation();
    this.bindSwipe();
    this.updateUI();
  }

  bindNavigation() {
    // Next Step Button
    const nextBtn = document.getElementById('workflow-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.currentStep < this.totalSteps) {
          this.goToStep(this.currentStep + 1);
        } else {
          // Restart celebration
          this.goToStep(1);
          window.diwaliAudio.playBell(523.25);
          window.diwaliParticles.showerCelebration(25);
        }
      });
    }

    // Previous Step Button
    const prevBtn = document.getElementById('workflow-prev-btn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentStep > 1) {
          this.goToStep(this.currentStep - 1);
        }
      });
    }

    // Step Nav Pills at the top
    const stepPills = document.querySelectorAll('.step-nav-pill');
    stepPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const targetStep = parseInt(pill.dataset.step, 10);
        if (targetStep) {
          this.goToStep(targetStep);
        }
      });
    });

    // Keyboard navigation (Left / Right arrow keys)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' && this.currentStep < this.totalSteps) {
        this.goToStep(this.currentStep + 1);
      } else if (e.key === 'ArrowLeft' && this.currentStep > 1) {
        this.goToStep(this.currentStep - 1);
      }
    });
  }

  bindSwipe() {
    const container = document.getElementById('workflow-container');
    if (!container) return;

    container.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      const deltaX = e.changedTouches[0].clientX - this.touchStartX;
      const deltaY = e.changedTouches[0].clientY - this.touchStartY;

      // Ensure horizontal swipe is dominant and significant (> 50px)
      if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        if (deltaX < 0 && this.currentStep < this.totalSteps) {
          // Swipe Left -> Next
          this.goToStep(this.currentStep + 1);
        } else if (deltaX > 0 && this.currentStep > 1) {
          // Swipe Right -> Prev
          this.goToStep(this.currentStep - 1);
        }
      }
    }, { passive: true });
  }

  goToStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > this.totalSteps) return;

    const prevStep = this.currentStep;
    this.currentStep = stepNumber;
    this.unlockedSteps.add(stepNumber);

    // Audio cue & haptic
    window.diwaliAudio.playBell(587.33 + (stepNumber * 60));
    window.diwaliAudio.triggerHaptic(18);

    this.updateUI(prevStep);

    // Step-specific entrance hooks
    if (stepNumber === 5 && window.greetingCardEngine) {
      window.greetingCardEngine.onEnter();
    }
  }

  unlockStep(stepNumber) {
    this.unlockedSteps.add(stepNumber);
    
    // Highlight step nav pill
    const pill = document.querySelector(`.step-nav-pill[data-step="${stepNumber}"]`);
    if (pill) pill.classList.add('completed');

    // Pulse the next button to guide the user forward
    const nextBtn = document.getElementById('workflow-next-btn');
    if (nextBtn) {
      nextBtn.classList.remove('pulse-action');
      void nextBtn.offsetWidth;
      nextBtn.classList.add('pulse-action');
    }
  }

  updateUI(prevStep = null) {
    // 1. Update Step Nav Pills
    const stepPills = document.querySelectorAll('.step-nav-pill');
    stepPills.forEach((pill) => {
      const stepVal = parseInt(pill.dataset.step, 10);
      const isActive = stepVal === this.currentStep;
      const isPast = stepVal < this.currentStep || this.unlockedSteps.has(stepVal);

      pill.classList.toggle('active', isActive);
      pill.classList.toggle('completed', isPast && !isActive);
      pill.setAttribute('aria-current', isActive ? 'step' : 'false');
    });

    // 2. Update Step Cards visibility with slide direction
    const stepCards = document.querySelectorAll('.workflow-step-card');
    stepCards.forEach((card) => {
      const stepVal = parseInt(card.dataset.step, 10);
      const isTarget = stepVal === this.currentStep;

      card.classList.toggle('active', isTarget);
      if (isTarget) {
        card.scrollTop = 0;
      }
    });

    // 3. Update Bottom Nav Buttons
    const prevBtn = document.getElementById('workflow-prev-btn');
    const nextBtn = document.getElementById('workflow-next-btn');
    const nextText = document.getElementById('next-btn-text');

    if (prevBtn) {
      prevBtn.style.visibility = this.currentStep > 1 ? 'visible' : 'hidden';
    }

    if (nextText) {
      nextText.textContent = this.stepNextTexts[this.currentStep] || 'Next ➔';
    }

    if (nextBtn) {
      // Remove pulse so it only triggers when step is interacted with
      nextBtn.classList.remove('pulse-action');
    }
  }
}

// Global instance
window.workflowManager = new WorkflowManager();

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Particle Engine
  window.diwaliParticles.init('bg-canvas', 'cracker-canvas');

  // 2. Initialize Workflow Steps
  window.diyaCeremony.init();
  window.rangoliStudio.init();
  window.mithaiFeast.init();
  window.crackerPlayground.init();
  window.greetingCardEngine.init();

  // 3. Initialize Workflow Manager
  window.workflowManager.init();

  // 4. Intro Curtain Gate
  const introOverlay = document.getElementById('intro-curtain-overlay');
  const enterBtn = document.getElementById('enter-celebration-btn');

  const enterCelebration = () => {
    if (!introOverlay) return;

    window.diwaliAudio.ensureContext();
    window.diwaliAudio.playBell(523.25);
    window.diwaliAudio.startAmbientMusic();
    window.diwaliParticles.showerCelebration(40);
    window.diwaliAudio.triggerHaptic([30, 40, 30]);

    introOverlay.classList.add('curtain-open');
    setTimeout(() => {
      introOverlay.style.display = 'none';
    }, 850);
  };

  if (enterBtn) {
    enterBtn.addEventListener('click', enterCelebration);
    enterBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      enterCelebration();
    });
  }

  // 5. Sound Mute / Music Toggle
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');
  const soundWaves = document.getElementById('sound-waves');

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      const isUnmuted = window.diwaliAudio.toggleMute();
      soundToggleBtn.classList.toggle('muted', !isUnmuted);
      if (soundIcon) soundIcon.textContent = isUnmuted ? '🔊' : '🔇';
      if (soundWaves) soundWaves.style.display = isUnmuted ? 'inline-flex' : 'none';
    });
  }

  // 6. Sky Crackers Background Toggle
  const skyFireworksBtn = document.getElementById('sky-fireworks-btn');
  if (skyFireworksBtn) {
    skyFireworksBtn.addEventListener('click', () => {
      const isEnabled = window.diwaliParticles.toggleAmbientCrackers();
      skyFireworksBtn.classList.toggle('active', isEnabled);
      skyFireworksBtn.style.opacity = isEnabled ? '1' : '0.5';

      const toast = document.getElementById('global-toast');
      if (toast) {
        toast.textContent = isEnabled ? '🎆 Sky Crackers: Burning in Background ✨' : '🎆 Sky Crackers: Paused ⏸️';
        toast.classList.add('visible');
        setTimeout(() => toast.classList.remove('visible'), 2200);
      }
      window.diwaliAudio.playBell(784);
      window.diwaliAudio.triggerHaptic(15);
    });
  }

  // 7. Fullscreen Toggle
  const fsBtn = document.getElementById('fullscreen-btn');
  if (fsBtn) {
    fsBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        fsBtn.textContent = '⤓';
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
          fsBtn.textContent = '⤢';
        }
      }
    });
  }
});
