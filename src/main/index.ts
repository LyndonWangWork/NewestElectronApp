import { app, shell, BrowserWindow, ipcMain, MessageChannelMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import TabsManager from '@/utils/TabManager'
import { MENU_BAR_HEIGHT } from '@/common/const'
import MainProcess from '@/common/PortBus/main'
import * as native from '../../resources/native/node-rdev.win32-x64-msvc.node'
native.default.startListener((event) => {
  //{"event_type":"ButtonRelease","name":null,"time":{"secs_since_epoch":1738476184,"nanos_since_epoch":857213900},"data":"{\"key\":\"Left\"}"}
  try {
    const json = JSON.parse(event)
    switch (json.event_type) {
      case 'ButtonRelease':
        const data = JSON.parse(json?.data || '{}')
        if (data.key === 'Left') {
          const text = native.default.getSelectionText()
          const pos = native.default.getMousePos()
          if (text) {
            MainProcess.emit('selectionText', { text, pos: pos.split('_') })
          }
        }
        break
    }
    // console.log('event', event)
  } catch (error) {
    console.error(error)
  }
})

const isDevelopment = process.env.NODE_ENV !== 'production'
let tabsManager: TabsManager
function createWindow(id?: string): BrowserWindow {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#cdcdcd',
      height: MENU_BAR_HEIGHT
      // symbolColor: 'white'
    },
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  mainWindow.on('close', async () => {
    // // 清除事件
    // mainWindow.webContents.removeAllListeners()
    // // 清除 Cookies、Storage、内存等数据
    // await mainWindow.webContents.session.clearData()
    // // 销毁窗口
    // mainWindow.destroy()
  })

  tabsManager = TabsManager.getInstance()

  MainProcess.connectWindow(mainWindow, id || Date.now().toString())
  // MainProcess.emit('test', { test: 21 })
  // MainProcess.on('testResult', (data) => {
  //   console.log('testResult', data)
  // })
  // port1.postMessage({ test: 21 })
  // const { port1, port2 } = new MessageChannelMain()

  // // 允许在另一端还没有注册监听器的情况下就通过通道向其发送消息 消息将排队等待，直到有一个监听器注册为止。
  // port2.postMessage({ test: 21 })

  // // 我们也可以接收来自渲染器主进程的消息。
  // port2.on('message', (event) => {
  //   console.log('from renderer main world:', event.data)
  // })
  // port2.start()
  // // 预加载脚本将接收此 IPC 消息并将端口
  // // 传输到主进程。
  // mainWindow.webContents.postMessage('register-port', null, [port1])
  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  // https://www.electronjs.org/zh/docs/latest/tutorial/notifications#windows
  // electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => {
    console.log('pong')
    // tabsManager.createTab('test', 'https://www.baidu.com')
  })
  MainProcess.on('addTab', (data) => {
    const added = tabsManager.createTab(data.label, data.url)
    MainProcess.emit('tabChanged', {
      tabs: tabsManager.getTabs(true)
    })
    MainProcess.emit('setTab', {
      key: added.key
    })
  })
  MainProcess.on('changeTab', (data) => {
    tabsManager.changeTabByKey(data.key)
    MainProcess.emit('setTab', {
      key: data.key
    })
  })
  MainProcess.on('removeCurrTab', (data) => {
    tabsManager.removeCurrTab()
  })
  MainProcess.on('removeTabByKey', (data) => {
    tabsManager.removeTabByKey(data.key)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
