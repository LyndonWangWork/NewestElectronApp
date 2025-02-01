# PortBus 使用说明

PortBus 是一个用于在 Electron 主进程和渲染进程之间进行通信的工具。它使用 MessageChannelMain 和 MessagePort 来实现双向通信。

## 安装

确保你已经安装了 Electron 和相关依赖。

```bash
npm install electron
```

## 使用方法

### 主进程

在主进程中，你需要初始化 PortBus 并连接窗口。

```typescript
// filepath:  src/main/index.ts
import MainProcess from '@/common/PortBus/main'

function createWindow(id?: string): BrowserWindow {
  const mainWindow = new BrowserWindow({
    // ...existing code...
  })

  // ...existing code...

  MainProcess.connectWindow(mainWindow, id || Date.now().toString())

  return mainWindow
}

app.whenReady().then(() => {
  createWindow()
  // ...existing code...
})
```

### 渲染进程

在渲染进程中，你需要初始化 PortBus 并监听消息。

```typescript
// filepath:  src/renderer/src/main.ts
import RendererBus from '@/common/PortBus/renderer'

RendererBus.on('someEvent', (event, data) => {
  console.log('Received someEvent:', data)
})

RendererBus.emit('someEvent', { key: 'value' })
```

### 预加载脚本

在预加载脚本中，你需要初始化 PortBus 并将端口传递给渲染进程。

```typescript
// filepath:  src/preload/index.ts
import PortBus from '@/common/PortBus/preload'

PortBus.init()
```

## 示例

### 主进程发送消息

```typescript
// filepath:  src/main/index.ts
MainProcess.emit('someEvent', { key: 'value' })
```

### 渲染进程接收消息

```typescript
// filepath:  src/renderer/src/main.ts
RendererBus.on('someEvent', (event, data) => {
  console.log('Received someEvent:', data)
})
```

### 渲染进程发送消息

```typescript
// filepath:  src/renderer/src/main.ts
RendererBus.emit('someEvent', { key: 'value' })
```

### 主进程接收消息

```typescript
// filepath:  src/main/index.ts
MainProcess.on('someEvent', (data) => {
  console.log('Received someEvent:', data)
})
```

通过以上步骤，你可以在 Electron 主进程和渲染进程之间实现双向通信。
