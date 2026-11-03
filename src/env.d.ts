/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 是否使用本地 mock 数据，对应 .env 里的 VITE_USE_MOCK */
  readonly VITE_USE_MOCK?: string
}
