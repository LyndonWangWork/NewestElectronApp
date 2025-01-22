<template>
  <vue3-tabs-chrome
    :tabs="props.tabs"
    v-model="tab"
    class="w-full text-gray-900 !bg-[--tab-background-color]"
  />
</template>
<script setup lang="ts">
import Vue3TabsChrome from 'vue3-tabs-chrome'
import 'vue3-tabs-chrome/dist/vue3-tabs-chrome.css'
import { ref } from 'vue'
// import { Icon } from '@iconify/vue'
// import { MENU_BAR_HEIGHT } from '@/common/const'
interface Props {
  tabs: ElectronTab[]
  activeTab?: number
}
const tab = ref('google')

const emit = defineEmits(['close-tab'])
const props = withDefaults(defineProps<Props>(), {
  tabs: () => [],
  activeTab: -1
})

// const handleCloseTab = (tab: ElectronTab) => {
//   emit('close-tab', tab)
// }
</script>
<style scoped lang="less">
.vue3-tabs-chrome {
  -webkit-app-region: drag;
  :deep(.tabs-item) {
    -webkit-app-region: no-drag;
  }
}
.tab {
  display: flex;
  align-items: center;
  background-color: var(--tab-background-color);
  border: none;
  border-radius: 5px;
  color: #595c78;
  cursor: pointer;
  position: relative;
  height: 100%;
  min-width: 80px;
  text-align: center;
  justify-content: center;
  font-size: 14px;
  &.active {
    background-color: #fff;
    border-radius: 12px 12px 0 0;
    box-shadow:
      12px 12px 0 0 #fff,
      -12px 12px 0 0 #fff;
    &::before {
      content: '';
      position: absolute;
      left: -12px;
      bottom: 0;
      width: 12px;
      height: 40px;
      background: var(--tab-background-color);
      border-radius: 0 0 12px 0;
    }
    &::after {
      content: '';
      position: absolute;
      right: -12px;
      bottom: 0;
      width: 12px;
      height: 40px;
      background: var(--tab-background-color);
      border-radius: 0 0 0 12px;
    }
  }
}
</style>
