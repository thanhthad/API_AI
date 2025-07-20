/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REACT_APP_API_URL: string;
  // Thêm các biến môi trường VITE_... khác của bạn vào đây nếu có
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}