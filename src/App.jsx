import DomeGallery from './components/DomeGallery';
import './index.css';

const IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1755331039789-7e5680e26e8f?q=80&w=774&auto=format&fit=crop',
    alt: 'Abstract art',
    name: 'Abstract Dimensions',
    description: 'An exploration of form and colour through generative abstraction.'
  },
  {
    src: 'https://images.unsplash.com/photo-1755569309049-98410b94f66d?q=80&w=772&auto=format&fit=crop',
    alt: 'Modern sculpture',
    name: 'Sculptural Study',
    description: 'Material, light and shadow in dialogue with physical space.'
  },
  {
    src: 'https://images.unsplash.com/photo-1755497595318-7e5e3523854f?q=80&w=774&auto=format&fit=crop',
    alt: 'Digital artwork',
    name: 'Digital Canvas',
    description: 'Where pixels meet craft — a fully digital illustration series.'
  },
  {
    src: 'https://images.unsplash.com/photo-1755353985163-c2a0fe5ac3d8?q=80&w=774&auto=format&fit=crop',
    alt: 'Contemporary art',
    name: 'Contemporary Fragment',
    description: 'Fragmented narratives rendered in layered mixed media.'
  },
  {
    src: 'https://images.unsplash.com/photo-1745965976680-d00be7dc0377?q=80&w=774&auto=format&fit=crop',
    alt: 'Geometric pattern',
    name: 'Grid Systems',
    description: 'Precision-based geometry exploring pattern and repetition.'
  },
  {
    src: 'https://images.unsplash.com/photo-1752588975228-21f44630bb3c?q=80&w=774&auto=format&fit=crop',
    alt: 'Textured surface',
    name: 'Surface Tension',
    description: 'Macro-level textures that reveal the hidden structure of materials.'
  },
  {
    src: 'https://pbs.twimg.com/media/Gyla7NnXMAAXSo_?format=jpg&name=large',
    alt: 'Social media image',
    name: 'Social Snapshot',
    description: 'A moment captured and distilled into a single frame.'
  }
];

export default function App() {
  return (
    <div className="portfolio-root">
      {/* Ambient glow blobs */}
      <div className="ambient-blob blob-1" />
      <div className="ambient-blob blob-2" />

      {/* Header */}
      <header className="portfolio-header">
        <div className="header-name">shifiyy</div>
        <nav className="header-nav">
          <a href="#contact">Contact</a>
        </nav>
      </header>

      {/* Dome Gallery — full viewport */}
      <div className="gallery-stage">
        <DomeGallery
          images={IMAGES}
          overlayBlurColor="#0a0810"
          grayscale={false}
          fit={0.55}
          minRadius={500}
          dragDampening={1.5}
          openedImageWidth="380px"
          openedImageHeight="480px"
          imageBorderRadius="20px"
          openedImageBorderRadius="24px"
        />
      </div>

      {/* Footer */}
      <footer className="portfolio-footer" id="contact">
        <p>Let&apos;s build something together</p>
        <a className="footer-cta" href="mailto:hello@example.com">Say hello →</a>
      </footer>
    </div>
  );
}
