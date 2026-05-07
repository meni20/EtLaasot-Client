import { useEffect, useState } from "react";

const MOBILE_WIDTH = 500;

export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < MOBILE_WIDTH
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_WIDTH);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
};
