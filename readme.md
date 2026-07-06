# ☢ HALFLIFE

> Radioactive decay, but it's your lifespan.

A fun, unserious calculator that applies radioactive decay math to human mortality. Pick an isotope, enter your birthdate, and see your personal decay stats — what if humans didn't age, but just had a fixed annual chance of "decaying"?

[Live Demo](https://aayushrathor.github.io/halflife)

---

## The Idea

Radioactive atoms don't age. Each atom has a fixed probability of decaying per unit time, regardless of how "old" it is — this is what half-life actually measures. **HalfLife** asks: *what if humans worked the same way?* No aging, just a fixed annual chance of "decaying." Pick a long enough half-life and you're functionally immortal — not guaranteed to live forever, but with odds so good that death becomes background noise.

---

## Features

### Core Calculator
- Enter your birthdate and pick a themed "isotope"
- See **% decayed** at your current age
- See your **annual death odds** expressed as "1 in X"
- Real-world odds comparison (lightning strike, royal flush, vending machine, four-leaf clover)
- Plain-language explanation putting the numbers in context
- Dynamic fun fact bank that updates per isotope

### 🎲 Roll for Survival
- Click to test your atomic luck against your exact annual death odds
- Geiger counter click sounds via Web Audio API (no audio files)
- **Survive:** Green flash + "PHEW! Your atom survived this year" with streak counter
- **Decay:** Pink flash + humorous "You randomly decayed into Lead-206. Good run!" Easter egg
- Streak tracks consecutive years survived

### ⏭️ Time Machine
- Drag the neobrutalist range slider to fast-forward through deep time
- Watch % decayed, survival odds, and age update in real time
- Slider range adapts per isotope (up to 5 half-lives, capped at 1M years)
- **Auto Fast-Forward** button: sit back and watch the years fly by with intensifying Geiger clicks — click rate maps to isotope radioactivity (frantic for Greenland Shark, barely ticking for Uranium-238)

### ☢️ Cohort Grid
- 1,000 clones born on your birthday with your isotope
- Canvas-rendered grid of 50×20 dots
- Alive dots glow neon green; decayed dots turn gray
- Updates in real time as the slider moves — seeing 500 dots vanish at the half-life makes the math tangible
- Each clone has a precomputed deterministic death year — no flickering on drag

---

## Isotope Themes

| Isotope | Half-Life | Personality |
|---------|-----------|-------------|
| 🦈 Greenland Shark | 400 years | Shortest-lived — you'll feel the decay |
| 🌳 Bristlecone Pine | 5,000 years | Moderate — outlives civilizations |
| ☢️ Classic | 10,000 years | Default — since before writing |
| ⭐ Big Blue Star | 1,000,000 years | Very stable — predates Homo sapiens |
| ☢️ Uranium-238 | 4.5 billion years | Nearly immortal — age of the Earth |

Half-life values are hidden in the dropdown for suspense — revealed in the results.

---

## Tech Stack

Zero frameworks, zero dependencies, zero build tools. Just vanilla:

- **HTML** — semantic structure
- **CSS** — neobrutalist design system (bold borders, hard shadows)
- **JavaScript** — ES6, Web Audio API, Canvas 2D

```
halflife/
├── index.html          # HTML structure
├── css/
│   └── styles.css      # All styles & animations
├── js/
│   ├── data.js         # Constants (odds, isotope facts)
│   ├── state.js        # Shared application state
│   ├── utils.js        # Pure functions (stats, formatting)
│   ├── sound.js        # Web Audio API Geiger counter
│   ├── cohort.js       # Canvas cohort grid rendering
│   ├── slider.js       # Time machine slider & auto fast-forward
│   ├── roll.js         # Roll for survival game logic
│   └── main.js         # Entry point, calculate, event listeners
└── readme.md
```

Load order ensures zero circular dependencies. Works by opening `index.html` directly in any browser — no server needed.

---

## Sound

All audio is synthesized at runtime via the **Web Audio API**:
- **Geiger click:** square wave (1200 Hz) + sine wave body (200 Hz), 40–70 ms envelope
- **Death sound:** sawtooth sweep (600 Hz → 80 Hz) over 500 ms
- **Auto fast-forward:** click rate scales per isotope — short half-lives click frantically, long ones tick slowly

No external audio files, no network requests.

---

## Design

Neobrutalist aesthetic throughout:
- Heavy black borders (`3px solid #000`)
- Hard box shadows with no blur (`6px 6px 0 #000`)
- High-contrast colors (neon green `#B6F84A`, electric blue `#7CD6FF`,警示 pink `#FF8FA3`, warm orange `#FFC24B`)
- Bold typography (`Arial Black`, uppercase, heavy weight)
- Press effects on buttons (shift + shadow disappear)
- Discrete-step spinning icon for loading state

---

## Deployment

The repo includes a [GitHub Actions workflow](.github/workflows/deploy.yml) that auto-deploys to **GitHub Pages** on every push to `main`.

### One-time setup

1. Go to your repo **Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. Push to `main` — the action runs automatically

The site deploys to `https://<user>.github.io/halflife/`.

---

## Local Dev

```bash
# Open directly in browser
open index.html

# Or serve locally
python3 -m http.server 8000
# → http://localhost:8000
```

No install, no `npm install`, no build step.

---

## Credits

Built by [aayushrathor](https://github.com/aayushrathor). Not actuarial advice. Share your isotope with a friend.
