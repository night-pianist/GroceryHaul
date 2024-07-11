/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_CONVEX_URL: string;
    // Add more environment variables here as needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  