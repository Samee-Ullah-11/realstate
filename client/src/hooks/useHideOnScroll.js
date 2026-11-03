import { useEffect, useState } from 'react';

// Hide the bar when scrolling down, reveal it on the first upward scroll.
export default function useHideOnScroll(threshold = 80) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y <= threshold) setHidden(false);
      else if (y > lastY + 2) setHidden(true);
      else if (y < lastY - 2) setHidden(false);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return hidden;
}
