import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    if (window.plausible) {
      window.plausible("pageview", {
        u: window.location.origin + location.pathname,
      });
    }
  }, [location]);
};
