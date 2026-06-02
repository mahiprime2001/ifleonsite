/// <reference types="vite/client" />

interface Window {
  plausible?: (event: string, options?: Record<string, unknown>) => void;
  dataLayer?: unknown[];
}
