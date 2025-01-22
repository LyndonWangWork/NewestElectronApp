import { app, BrowserWindow, WebContentsView } from 'electron'
import { MENU_BAR_HEIGHT } from '@/common/const'

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

  public createTab(label: string, url: string): void {
    this.mainWindow = BrowserWindow.getAllWindows()[0]
    const newTab: ElectronTab = {
      key: this.tabs.length.toString() + ' ' + url,
      label,
      url,
      lastActiveAt: Date.now()
    }

    newTab.webContentsView = this.createTabView(url)
    this.tabs.push(newTab)
    this.setCurrentTab(this.tabs.length - 1)
  }
  private createTabView(url: string): WebContentsView {
    const webContentsView = new WebContentsView()
    webContentsView.webContents.loadURL(url)
    return webContentsView
  }

  public setCurrentTab(index: number): void {
    if (index < 0 || index >= this.tabs.length) {
      throw new Error('Invalid tab index')
    }
    if (this.currentTab) {
      this.mainWindow.contentView.removeChildView(this.currentTab.webContentsView!)
    }
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

  public getTabs(): ElectronTab[] {
    return this.tabs
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
