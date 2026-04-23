import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function isScrolledPastThreshold(threshold) {
  return window.scrollY > threshold;
}

export default function ScrollToTopButton({ threshold = 240 }) {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let frameId = 0;

    const syncVisibility = () => {
      frameId = 0;
      setIsVisible(isScrolledPastThreshold(threshold));
    };

    const handleScroll = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(syncVisibility);
    };

    syncVisibility();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [threshold]);

  useEffect(() => {
    setIsVisible(isScrolledPastThreshold(threshold));
  }, [location.pathname, threshold]);
  //클릭하면 맨위로 가게
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      className={`scroll-top-button ${isVisible ? "is-visible" : ""}`}
      onClick={handleClick}
      aria-label="Scroll to top"
      title="Top"
    >
      <span aria-hidden="true">^</span>
    </button>
  );
}
