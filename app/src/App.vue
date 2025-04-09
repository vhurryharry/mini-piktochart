<template>
  <div class="h-100 w-100">
    <div class="row h-100 w-100 m-0">
      <Sidebar @add-text="addTextToCanvas" @add-image="addImageToCanvas" />
      <Canvas :items="canvasItems" @delete-item="deleteItem" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Canvas from './components/Canvas.vue'

const canvasItems = ref([])

function addTextToCanvas(text) {
  canvasItems.value.push({ type: 'text', content: text, id: Date.now(), x: 100, y: 100 })
}

function addImageToCanvas(url) {
  canvasItems.value.push({ type: 'image', src: url, id: Date.now(), x: 100, y: 100 })
}

function deleteItem(id) {
  canvasItems.value = canvasItems.value.filter(item => item.id !== id)
}

onMounted(() => {
  const saved = localStorage.getItem('canvasItems')
  if (saved) canvasItems.value = JSON.parse(saved)
})

watch(canvasItems, (newVal) => {
  localStorage.setItem('canvasItems', JSON.stringify(newVal))
}, { deep: true })
</script>
