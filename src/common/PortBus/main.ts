import { MessageChannelMain, MessagePortMain } from 'electron'
class MainPort {
  // private ports: MessagePortMain[] = []
  private listeners: { [key: string]: Function[] } = {}
  private windowsMap: Map<string, Electron.BrowserWindow>
  private portsMap: Map<string, MessagePortMain>

  constructor() {
    this.windowsMap = new Map()
    this.portsMap = new Map()
  }

  connectWindow(win: Electron.BrowserWindow, id: string) {
    const { port1, port2 } = new MessageChannelMain()
    port1.on('message', (event) => {
      console.log('port1 message', event)
      this.onMessage(event.data, event)
    })
    port1.start()
    // this.ports.push(port1)
    this.portsMap.set(id, port1)
    this.windowsMap.set(id, win)
    win.webContents.postMessage('register-port', null, [port2])
    return port1
  }
  onMessage(data: any, msgEvent: Electron.MessageEvent) {
    console.log(data)
    const { event, id } = data
    if (id) {
      this.emitTo(id, event, data)
      return
    }
    if (!this.listeners[event]) return
    this.listeners[event].forEach((listener) => listener(data))
  }
  on(event: string, listener: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    } else {
      if (this.listeners[event].includes(listener)) return
    }
    this.listeners[event].push(listener)
  }
  off(event: string, listener?: Function) {
    if (!this.listeners[event]) return
    if (!listener) {
      this.listeners[event] = []
      return
    }
    const index = this.listeners[event].indexOf(listener)
    if (index !== -1) {
      this.listeners[event].splice(index, 1)
    }
  }
  emit(event: string, ...args: any[]) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((listener) => listener(...args))
    }
    Array.from(this.portsMap.values()).forEach((port) => {
      port.postMessage({ event, args })
    })
  }
  emitTo(id: string, event: string, ...args: any[]) {
    const port = this.portsMap.get(id)
    if (!port) {
      console.error(`port for ${id} not found`)
      return
    }
    port.postMessage({ event, args })
  }
}

export default new MainPort()
