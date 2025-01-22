/// <reference types="vite/client" />

declare type ElectronTab = import('vue3-tabs-chrome').Tab & {
  webContentsView?: WebContentsView
  lastActiveAt?: number
  url?: string
}
