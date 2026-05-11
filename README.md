# shifiyy

A minimal, interactive portfolio built around a **3D dome image gallery** — drag to explore, click to open.

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white&style=flat-square)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white&style=flat-square)](https://vitejs.dev)
[![use-gesture](https://img.shields.io/badge/@use--gesture%2Freact-latest-ff6b6b?style=flat-square)](https://use-gesture.netlify.app)

---

## ✨ Features

- **Interactive 3D dome** — drag to spin the gallery in any direction with smooth inertia
- **Click to enlarge** — tap any tile to expand it with a fluid scale animation
- **Image captions** — each enlarged image reveals its name and description
- **Dark, immersive design** — deep purple/blue ambient glow, edge fade-outs
- **Fully responsive** — adapts radius and padding to any viewport size

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| [React 19](https://react.dev) | UI framework |
| [Vite 8](https://vitejs.dev) | Dev server & bundler |
| [@use-gesture/react](https://use-gesture.netlify.app) | Drag & inertia gestures |
| Vanilla CSS | All styling — no utility framework |
| [Google Fonts](https://fonts.google.com) | Inter + Syne typefaces |

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server runs at **http://localhost:5173/** by default.

## 📁 Project Structure

```
src/
├── components/
│   ├── DomeGallery.jsx   # 3D dome gallery (React Bits)
│   └── DomeGallery.css   # Component styles
├── App.jsx               # Portfolio page + image data
├── index.css             # Global theme & layout
└── main.jsx              # Entry point
```

## 🖼 Adding Your Images

Edit the `IMAGES` array in `src/App.jsx`:

```js
const IMAGES = [
  {
    src: 'https://your-image-url.jpg',
    alt: 'Alt text for accessibility',
    name: 'Project Title',
    description: 'A short description shown when the image is opened.'
  },
  // ...
];
```

Images can be URLs (Unsplash, CDN, etc.) or local files placed in `public/`.

## ⚙️ DomeGallery Props

| Prop | Default | Description |
|------|---------|-------------|
| `images` | built-in set | Array of `{ src, alt, name, description }` objects |
| `fit` | `0.55` | Dome radius as a fraction of container size |
| `minRadius` | `500` | Minimum dome radius in px |
| `overlayBlurColor` | `#0a0810` | Edge fade colour — match your background |
| `grayscale` | `false` | Render tiles in greyscale |
| `dragDampening` | `1.5` | Inertia damping (higher = stops sooner) |
| `openedImageWidth` | `380px` | Enlarged image width |
| `openedImageHeight` | `480px` | Enlarged image height |
| `imageBorderRadius` | `20px` | Tile corner radius |
| `openedImageBorderRadius` | `24px` | Enlarged image corner radius |

---

> Component based on [DomeGallery](https://www.reactbits.dev) from React Bits.
