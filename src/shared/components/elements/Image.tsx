import React, { useState, useRef, useEffect } from 'react';

interface ImageProps {
  src: string;
  width: string | number;
  height: string | number;
  className?: string;
  alt?: string;
}

const Image: React.FC<ImageProps> = ({ className, src, width, height, alt }) => {
  const [loaded, setLoaded] = useState(false);

  const image = useRef(null);

  useEffect(() => {
    handlePlaceholder(image.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const placeholderSrc = (w, h) => {
    return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"%3E%3C/svg%3E`;
  };

  const handlePlaceholder = (img) => {
    const placeholder = document.createElement('img');
    if (!loaded) {
      img.style.display = 'none';
      img.before(placeholder);
      placeholder.src = placeholderSrc(img.getAttribute('width') || 0, img.getAttribute('height') || 0);
      placeholder.width = img.getAttribute('width');
      placeholder.height = img.getAttribute('height');
      placeholder.style.opacity = '0';
      img.className && placeholder.classList.add(img.className);
      placeholder.remove();
      img.style.display = '';
    }
  };

  function onLoad() {
    setLoaded(true);
  }

  return React.cloneElement(
    <img
      style={{ verticalAlign: 'top' }}
      ref={image}
      className={className}
      src={src}
      width={width}
      height={height}
      alt={alt}
      onLoad={onLoad}
    />,
  );
};

export default Image;
