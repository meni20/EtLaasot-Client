import { useEffect, useRef, useState } from "react";

const DEFAULT_ROOT_MARGIN = "320px";

export const useDeferredBackgroundImage = (
  imageUrl: string | null | undefined,
  rootMargin = DEFAULT_ROOT_MARGIN,
) => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (!imageUrl) {
      setShouldLoad(false);
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }

    const element = elementRef.current;
    if (!element) {
      setShouldLoad(true);
      return;
    }

    setShouldLoad(false);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [imageUrl, rootMargin]);

  return { elementRef, shouldLoad };
};
