import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DomeGallery from '../components/DomeGallery';

const ease = [0.22, 1, 0.36, 1];

export default function HomePage() {
  const [images, setImages] = useState(null);

  useEffect(() => {
    fetch('/projects.json?t=' + Date.now())
      .then(r => r.json())
      .then(data => setImages(data))
      .catch(() => setImages([]));
  }, []);

  return (
    <div className="portfolio-root">
      <motion.header
        className="portfolio-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease }}
      >
        <div className="header-name">
          {'shifiyy'.split('').map((char, i) => (
            <motion.span
              key={i}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.05, ease }}
              style={{ display: 'inline-block' }}
            >
              {char}
            </motion.span>
          ))}
        </div>
        <motion.nav
          className="header-nav"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.75 }}
        >
          <a href="#contact">contact</a>
        </motion.nav>
      </motion.header>

      <div className="gallery-stage">
        {images === null ? (
          <div className="gallery-loading">
            <span className="gallery-loading-dot" />
          </div>
        ) : images.length === 0 ? (
          <div className="gallery-empty">
            <p>no projects yet.</p>
            <a href="#/admin">add your first project →</a>
          </div>
        ) : (
          <DomeGallery
            images={images}
            overlayBlurColor="#0C0C0C"
            grayscale={false}
            fit={0.55}
            minRadius={500}
            dragDampening={1.5}
            openedImageWidth="640px"
            openedImageHeight="460px"
            imageBorderRadius="20px"
            openedImageBorderRadius="20px"
          />
        )}
      </div>

      <motion.footer
        className="portfolio-footer"
        id="contact"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, delay: 0.3, ease }}
      >
        <p>got a project that needs to be seen?</p>
        <a className="footer-cta" href="mailto:hello@example.com">say hello →</a>
      </motion.footer>
    </div>
  );
}
