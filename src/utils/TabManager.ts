import { app, BrowserWindow, WebContentsView } from 'electron'
import { MENU_BAR_HEIGHT } from '@/common/const'
import { Tab } from 'vue3-tabs-chrome'

class TabsManager {
  private static instance: TabsManager
  private tabs: ElectronTab[] = []
  private currentTab: ElectronTab | null = null
  private mainWindow: BrowserWindow
  // private appInstance: Electron.App

  private constructor() {
    this.mainWindow = BrowserWindow.getAllWindows()[0]
    if (this.mainWindow) this.mainWindow.on('resize', this.resize.bind(this))
  }

  public static getInstance(): TabsManager {
    if (!TabsManager.instance) {
      TabsManager.instance = new TabsManager()
    }
    return TabsManager.instance
  }

  public createTab(label: string, url: string): ElectronTab {
    this.mainWindow = BrowserWindow.getAllWindows()[0]
    const newTab: ElectronTab = {
      key: this.tabs.length.toString() + '# ' + url,
      label,
      url,
      lastActiveAt: Date.now()
    }

    newTab.webContentsView = this.createTabView(url)
    this.tabs.push(newTab)
    this.setCurrentTab(this.tabs.length - 1)
    return {
      key: newTab.key,
      label: newTab.label,
      url: newTab.url,
      lastActiveAt: newTab.lastActiveAt
    }
  }
  private createTabView(url: string): WebContentsView {
    const webContentsView = new WebContentsView()
    webContentsView.webContents.loadURL(url)
    return webContentsView
  }

  public removeCurrTab(): void {
    if (this.currentTab && this.currentTab.webContentsView) {
      this.mainWindow.contentView.removeChildView(this.currentTab.webContentsView)
    }
  }

  public removeTabByIdx(idx: number): void {
    console.log('removeTabByIdx', idx, this.tabs)
    if (idx < 0 || idx >= this.tabs.length) {
      throw new Error('Invalid tab idx: ' + idx)
    }
    const removedTab = this.tabs.splice(idx, 1)[0]
    if (removedTab.webContentsView) {
      this.mainWindow.contentView.removeChildView(removedTab.webContentsView)
    }
  }

  public removeTabByKey(key: string): void {
    console.log('removeTabByKey', key, this.tabs)
    const idx = this.findTabIndex(key)
    if (idx === -1) {
      throw new Error('Tab not found:' + key)
    }
    const removedTab = this.tabs.splice(idx, 1)[0]
    if (removedTab.webContentsView) {
      this.mainWindow.contentView.removeChildView(removedTab.webContentsView)
    }
  }

  public findTabIndex(key: string): number {
    const index = this.tabs.findIndex((tab) => tab.key === key)
    return index
  }

  public changeTabByKey(key: string) {
    const index = this.findTabIndex(key)
    if (index !== -1) {
      this.setCurrentTab(index)
    } else {
      throw new Error('Tab not found: ' + key)
    }
  }

  public setCurrentTab(index: number): void {
    if (index < 0 || index >= this.tabs.length) {
      throw new Error('Invalid tab index: ' + index)
    }
    this.removeCurrTab()
    this.currentTab = this.tabs[index]
    if (!this.currentTab.webContentsView) {
      this.currentTab.webContentsView = this.createTabView(this.currentTab.url!)
    }
    this.mainWindow.contentView.addChildView(this.currentTab.webContentsView)
    this.currentTab.lastActiveAt = Date.now()
    this.resize()
  }

  public getCurrentTab(): ElectronTab | null {
    return this.currentTab
  }

  public getTabs(simple = false): ElectronTab[] {
    if (!simple) return this.tabs
    return this.tabs.map((tab) => {
      return {
        key: tab.key,
        label: tab.label,
        url: tab.url,
        lastActiveAt: tab.lastActiveAt
      }
    })
  }

  public resize() {
    if (!this.currentTab) return
    const bounds = this.mainWindow.getContentBounds()
    this.currentTab.webContentsView.setBounds({
      x: 0,
      y: MENU_BAR_HEIGHT,
      width: bounds.width,
      height: bounds.height
    })
  }
}

export default TabsManager
