<template>
  <h1
    class="custom-titlebar h-full select-none absolute top-0 left-0 w-full bg-(--tab-background-color) text-gray-900 flex items-center px-3"
  >
    {{ props.title }}
  </h1>
</template>
<script setup lang="ts">
const props = defineProps({
  title: String
})
</script>
