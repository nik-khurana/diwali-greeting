# ✨ Shubh Deepawali | Interactive Festival Journey ✨

A delightful, mobile-first, story-driven interactive Diwali greeting web experience designed to be hosted seamlessly on **GitHub Pages**.

[Live Demo Preview](https://nik-khurana.github.io/interactive-diwali-greeting/)

---

## 🌟 The Single Interactive Celebration Journey

Instead of disconnected utility tabs, this experience guides the recipient through a **5-step festive celebration workflow**:

1. 🪔 **Step 1: Kindle the Sacred Light (दीप प्रज्वलन)**
   - Centerpiece: A grand clay diya on a golden pedestal.
   - Touch the wick to kindle the flame with warm whoosh and sparkling embers.
   - Sitar chords in **Raag Bhupali** swell, temple bells chime, and ambient golden glow warms up the night.
   - Auspicious Sanskrit blessing (*Asato Ma Sadgamaya*) is revealed.

2. 🎨 **Step 2: Adorn the Rangoli (रंगोली सजावट)**
   - Centerpiece: A sacred geometric lotus mandala rangoli.
   - Tap vibrant holy powder colors (Saffron, Marigold, Gulal Pink, Peacock Teal, Sindoor Red, Gold).
   - Each touch splashes authentic powder dust particles with musical marimba pops.
   - Includes a **✨ Magic Splash** button for an instant rainbow burst!

3. 🍬 **Step 3: Taste the Festive Sweets (शुभ मिष्ठान्न)**
   - Centerpiece: A royal brass thali loaded with iconic sweets:
     * **Kaju Katli** (with edible silver vark)
     * **Gulab Jamun** (warm cardamom nectar)
     * **Motichoor Laddu** (golden ghee pearls)
     * **Crispy Jalebi** (saffron swirls)
   - Tap any sweet to take virtual bites: crunchy munch sound, bite mark physics, and calorie-free festival humor (*"100% Love, 0% Calories!"*).

4. 🎆 **Step 4: Spark the Night Sky (पावन आतिशबाजी)**
   - Centerpiece: An eco-friendly virtual cracker arena.
   - Drag your finger across the sky to paint glowing, hissing **Phooljhadi (Sparkler)** light trails!
   - Tap anywhere or click **🚀 Burst Sky Rocket** to launch aerial fireworks.
   - Includes a **🌟 Grand Finale Show** button.

5. 💌 **Step 5: Your Grand Blessing & Personalized Card (शुभकामना पत्र)**
   - Celebration fanfare with a shower of golden marigold petals and background fireworks!
   - The personalized greeting card unfolds with custom recipient name, heartfelt blessing, and sender sign-off.
   - **One-Click Sharing**:
     * 💬 Share on WhatsApp
     * 🔗 Copy Custom Link
     * 📥 Download high-res Card Image (PNG)
     * ✍️ Collapsible drawer to customize sender/recipient names and send it to friends!
     * 🔄 "Relive Celebration" restarts the magical journey.

---

## 📱 Navigation & Mobile Features
- **Step Navigation Progress Bar**: Clickable step pills at the top (`1 🪔 Light` ➔ `2 🎨 Colors` ➔ `3 🍬 Mithai` ➔ `4 🎆 Spark` ➔ `5 💌 Blessing`).
- **Touch Swipe Gestures**: Swipe left to proceed to the next step, swipe right to go back.
- **Pulsing Action Button**: Next button pulses with radiant gold glow as soon as an interaction is completed.
- **Continuous Ambient Background Fireworks**: Distant fireworks gently burst in the night sky behind cards (toggleable via the top 🎆 button).
- **Procedural Web Audio API**: Zero external audio files — 100% generated procedurally with instant responsiveness and offline capability.
- **`100dvh` Viewport & Safe-Area Insets**: Optimized for iOS Safari and Android Chrome address bars and home indicators.

---

## 🪔 Personalized URL Parameters
You can personalize the recipient experience directly via link query parameters:
```
https://nik-khurana.github.io/interactive-diwali-greeting/?from=Nikhil&to=Friends%20and%20Family
```
- `?from=YourName`: Sets the sender name
- `?to=RecipientName`: Sets the recipient name on the final blessing card
- `?wish=YourMessage`: Pre-populates a custom blessing

---

## 🚀 How to Host on GitHub Pages (Zero-Config)

```bash
git add .
git commit -m "feat: transform into single-workflow interactive Diwali greeting journey"
git push origin main
```
GitHub Pages will automatically deploy the update within 30 seconds at:
```
https://nik-khurana.github.io/interactive-diwali-greeting/
```
