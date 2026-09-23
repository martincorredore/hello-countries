# Hello Countries

An interactive site that brings the world a little closer. Explore a 3D globe, say hello in different languages, and discover stories and fun facts about five countries.

**[Visit the live site](https://hicountries.netlify.app)**

## Features

- **Interactive 3D globe** — drag to rotate, scroll to zoom, and fly to your selected country.
- **Five countries** — explore Colombia, the United States, Argentina, Spain, and Germany.
- **Country theme colors** — the interface adapts to each destination with flag-inspired colors.
- **Fun facts** — discover each country's culture, landmarks, and geography through its field guide.
- **Keyboard shortcuts** — jump between destinations or return home with a keystroke.

## Keyboard shortcuts

| Key | Action |
| --- | --- |
| `1` | Explore Colombia |
| `2` | Explore the United States |
| `3` | Explore Argentina |
| `4` | Explore Spain |
| `5` | Explore Germany |
| `H` or `Esc` | Return home |

## Tech stack

- **HTML** — page structure and content.
- **CSS** — responsive layout, theme colors, and animations.
- **JavaScript** — interactions, country guides, and globe controls.
- **globe.gl** — interactive 3D globe rendering.

## Run locally

With Python 3 installed, run this command from the project directory:

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) in your browser.

No build step or package installation is required. An internet connection is needed to load external libraries, fonts, and globe assets.
