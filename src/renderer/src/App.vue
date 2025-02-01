<script setup lang="ts">
import { ref } from 'vue'
import Versions from './components/Versions.vue'
import Tabs from '@renderer/components/Tabs.vue'
// import Header from '@renderer/components/Header.vue'
import { MENU_BAR_HEIGHT } from '@/common/const'

import RendererBus from '@/common/PortBus/renderer'
// RendererBus.init()

// RendererBus.on('test', (messageEvent, ...args) => {
//   console.log('test', messageEvent, args)
//   const [data] = args
//   RendererBus.emit('testResult', { event: 'testResult', result: data.test * 2 })
// })

// RendererBus.on('tabChanged', (_messageEvent, ...args) => {
//   const [allTabs] = args
//   console.log(allTabs.tabs)
//   // allTabs.tabs
//   //   .filter((t: ElectronTab) => !tabs.value.find((_t) => _t.key === t.key))
//   //   .forEach((t: ElectronTab) => {
//   //     tabRef.value?.addTab(t)
//   //   })
// })

// const tabs = ref<ElectronTab[]>([
//   {
//     label: 'Home',
//     closable: false,
//     key: 'Home'
//   }
// ])
const tabRef = ref<InstanceType<typeof Tabs>>()
const handleClick = (label: string, url: string) => {
  // console.log('handleClick', label, url)
  RendererBus.emit('addTab', { event: 'addTab', label, url })
}

// window.onmessage = (event) => {
//   console.log('onmessage', event)
//   // event.source === window 意味着消息来自预加载脚本
//   // 而不是来自iframe或其他来源
//   if (event.source === window && event.data === 'register-port') {
//     const [port] = event.ports
//     // 一旦我们有了这个端口，我们就可以直接与主进程通信
//     port.onmessage = (event) => {
//       console.log('from main process:', event.data)
//       port.postMessage(event.data.test * 2)
//     }
//   }
// }
</script>

<template>
  <div
    class="absolute flex top-0 left-0 w-full bg-(--tab-background-color)"
    :style="{ height: MENU_BAR_HEIGHT + 'px' }"
  >
    <!-- <Header title="Hello Electron"></Header> -->
    <Tabs ref="tabRef"></Tabs>
  </div>
  <div class="text">
    <div class="p-2 cursor-pointer" @click="handleClick('baidu', 'https://www.baidu.com')">
      Baidu
    </div>
    <div class="p-2 cursor-pointer" @click="handleClick('bing', 'https://www.bing.com')">Bing</div>
  </div>

  <Versions />
</template>
<style lang="less" scoped>
.custom-titlebar {
  -webkit-app-region: drag;
}
</style>
