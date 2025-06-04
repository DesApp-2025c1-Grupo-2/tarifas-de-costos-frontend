interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    // podés agregar más variables aquí si querés
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }