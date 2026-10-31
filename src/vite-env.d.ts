/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the dashboard's public API. Defaults to https://dashboard.ifleon.com/api/public */
  readonly VITE_API_BASE?: string;
}
