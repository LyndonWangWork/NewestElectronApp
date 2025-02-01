class RendererBus {
  private listeners: { [key: string]: Function[] } = {}
  private port: MessagePort | null = null
  init() {
    window.onmessage = (event) => {
      console.log('onmessage', event)
      // event.source === window 意味着消息来自预加载脚本
      // 而不是来自iframe或其他来源
      if (event.source === window && event.data === 'register-port') {
        const [port] = event.ports
        this.port = port
        this.port!.start()
        // 一旦我们有了这个端口，我们就可以直接与主进程通信
        port.onmessage = (evt) => {
          console.log('from main process:', evt)
          this.onMessage(evt)
          // port.postMessage(event.data.test * 2)
        }
      }
    }
  }
  onMessage(msgEvent?: MessageEvent) {
    const data = msgEvent?.data
    console.log(data, this.listeners)
    const { event } = data
    if (!this.listeners[event]) return
    this.listeners[event].forEach((listener) => listener(msgEvent, ...msgEvent?.data.args))
  }
  emit(event: string, data: any) {
    console.log('renderer emit', event, data)
    this.port?.postMessage(data)
  }
  emitTo(id: string, event: string, data: any) {
    console.log('renderer emitTo', id, event, data)
    this.port?.postMessage({ id, event, data })
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
}
const rendererBus = new RendererBus()
rendererBus.init()
export default rendererBus
