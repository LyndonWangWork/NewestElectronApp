<script setup lang="ts">
import { reactive } from 'vue'

const versions = reactive({ ...window.electron.process.versions })

const ipcHandle = () => window.electron.ipcRenderer.send('ping')
</script>

<template>
  <div class="versions flex text-sm">
    <div class="flex">
      <div>
        <a
          href="https://electron-vite.org/"
          target="_blank"
          rel="noreferrer"
          class="mr-1 bg-slate-500 px-2 py-1 rounded-sm cursor-pointer"
          >Doc</a
        >
        <a
          class="bg-slate-500 px-2 py-1 rounded-sm cursor-pointer"
          target="_blank"
          rel="noreferrer"
          @click="ipcHandle"
          >IPC evt</a
        >
      </div>
      <div>
        <p class="ml-1">Press<code>F12</code>to open devTool</p>
      </div>
    </div>
    <ul class="flex items-center">
      <li class="electron-version">Electron v{{ versions.electron }}</li>
      <li class="chrome-version">Chromium v{{ versions.chrome }}</li>
      <li class="node-version">Node v{{ versions.node }}</li>
    </ul>
  </div>
</template>
