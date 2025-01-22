<script setup lang="ts">
import { ref } from 'vue'
import Versions from './components/Versions.vue'
import Tabs from '@renderer/components/Tabs.vue'
// import Header from '@renderer/components/Header.vue'
import { MENU_BAR_HEIGHT } from '@/common/const'

const tabs: ElectronTab[] = [
  {
    label: 'Home',
    closable: false,
    key: 'Home'
  }
]
const tabRef = ref<InstanceType<typeof Tabs>>()

const handleClick = (label: string, url: string) => {
  console.log('handleClick', label, url)
}
</script>

<template>
  <div
    class="absolute flex top-0 left-0 w-full bg-[--tab-background-color]"
    :style="{ height: MENU_BAR_HEIGHT + 'px' }"
  >
    <!-- <Header title="Hello Electron"></Header> -->
    <Tabs :tabs="tabs" ref="tabRef"></Tabs>
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
