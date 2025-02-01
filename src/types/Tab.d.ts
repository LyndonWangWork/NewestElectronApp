/// <reference types="vite/client" />

declare type ElectronTab = import('vue3-tabs-chrome').Tab & {
  webContentsView?: WebContentsView
  lastActiveAt?: number
  url?: string
}
declare type ElectronTabBase = Partial<BaseElectronTab> & Pick<BaseElectronTab, 'url' | 'label'>
