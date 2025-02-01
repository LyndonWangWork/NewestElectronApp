import { ipcRenderer } from 'electron'

class PortBus {
  // private listeners: { [key: string]: Function[] } = {}
  init() {
    // 在发送端口之前，我们需要等待主窗口准备好接收消息 我们在预加载时创建此 promise ，以此保证
    // 在触发 load 事件之前注册 onload 侦听器。
    const windowLoaded = new Promise((resolve) => {
      window.onload = resolve
    })

    ipcRenderer.on('register-port', async (event) => {
      console.log('preload register-port', event)
      await windowLoaded // 等待窗口加载完成
      window.postMessage('register-port', '*', event.ports)
    })
  }
}
const portBus = new PortBus()
portBus.init()
export default portBus
