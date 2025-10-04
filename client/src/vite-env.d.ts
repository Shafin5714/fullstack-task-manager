/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string; // your variable name here
  // add more if you have others
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
