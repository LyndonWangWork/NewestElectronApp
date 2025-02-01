<template>
  <vue3-tabs-chrome
    ref="tabRef"
    :tabs="tabs"
    v-model="tab"
    class="w-full text-gray-900 !bg-[--tab-background-color]"
    @remove="onRemove"
  />
</template>
<script setup lang="ts">
import Vue3TabsChrome from 'vue3-tabs-chrome'
import 'vue3-tabs-chrome/dist/vue3-tabs-chrome.css'
import { ref, watch, nextTick, onMounted } from 'vue'
import RendererBus from '@/common/PortBus/renderer'

const tabs = ref<ElectronTab[]>([
  {
    label: 'Home',
    closable: false,
    key: 'Home'
  }
])
onMounted(() => {
  tab.value = tabs.value[0].key
  tabs.value.forEach((t) => {
    if (!tabRef.value?.tabs.find((_t) => _t.key === t.key)) {
      tabRef.value?.addTab(t)
    }
  })
})

RendererBus.on('tabChanged', (_messageEvent, ...args) => {
  nextTick(() => {
    const [data] = args

    data.tabs
      .filter((t: ElectronTab) => !tabs.value.find((_t) => _t.key === t.key))
      .forEach((t: ElectronTab) => {
        tabRef.value?.addTab(t)
      })
    if (data.added) {
      tab.value = data.added.key
    }
  })
})

RendererBus.on('setTab', (_messageEvent, ...args) => {
  nextTick(() => {
    const [data] = args
    if (data.key) {
      tab.value = data.key
    }
  })
})

RendererBus.on('addTab', (_messageEvent, ...args) => {
  console.log(args)
})

// interface Props {
//   tabs?: ElectronTab[]
//   activeTab?: number
// }

const tab = ref('')
const tabRef = ref<InstanceType<typeof Vue3TabsChrome>>()

const emit = defineEmits(['close-tab'])
// const props = withDefaults(defineProps<Props>(), {
//   tabs: () => [],
//   activeTab: -1
// })

const onRemove = (tab: any, idx: string) => {
  console.log('onRemove', tab, idx)
  RendererBus.emit('removeTabByKey', { event: 'removeTabByKey', key: tab.key })
}
watch(
  () => tab.value,
  (newVal, oldVal) => {
    console.log('tab changed', newVal, oldVal)
    if (newVal === 'Home') {
      RendererBus.emit('removeCurrTab', { event: 'removeCurrTab' })
    } else {
      RendererBus.emit('changeTab', { event: 'changeTab', key: newVal })
    }
  },
  {
    immediate: true,
    deep: true
  }
)
</script>
<style scoped lang="less">
.vue3-tabs-chrome {
  -webkit-app-region: drag;
  :deep(.tabs-item) {
    -webkit-app-region: no-drag;
  }
  :deep(.tabs-content) {
    height: 100%;
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
