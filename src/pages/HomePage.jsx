import { useEffect, useState } from 'react';
import DomeGallery from '../components/DomeGallery';

export default function HomePage() {
  const [images, setImages] = useState(null); // null = loading

  useEffect(() => {
    fetch('/projects.json?t=' + Date.now())
      .then(r => r.json())
      .then(data => setImages(data))
      .catch(() => setImages([]));
  }, []);

  return (
    <div className="portfolio-root">
      <div className="ambient-blob blob-1" />
      <div className="ambient-blob blob-2" />

      <header className="portfolio-header">
        <div className="header-name">shifiyy</div>
        <nav className="header-nav">
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <div className="gallery-stage">
        {images === null ? (
          <div className="gallery-loading">
            <span className="gallery-loading-dot" />
          </div>
        ) : images.length === 0 ? (
          <div className="gallery-empty">
            <p>No projects yet.</p>
            <a href="#/admin">Add your first project →</a>
          </div>
        ) : (
          <DomeGallery
            images={images}
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
        )}
      </div>

      <footer className="portfolio-footer" id="contact">
        <p>Let&apos;s build something together</p>
        <a className="footer-cta" href="mailto:hello@example.com">Say hello →</a>
      </footer>
    </div>
  );
}
