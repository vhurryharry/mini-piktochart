<template>
    <div class="canvas col-10">
        <div class="block canvas-content mx-auto mt-3 position-relative"
            style="min-height: 500px; border: 1px solid #ccc">
            <CanvasItem v-for="item in items" :key="item.id" :item="item" @delete="id => $emit('delete-item', id)" />
        </div>
    </div>
</template>

<script setup>
import CanvasItem from './CanvasItem.vue'

defineProps({ items: Array })
</script>