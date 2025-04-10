<template>
    <div class="position-absolute border p-2 bg-white"
        :style="{ top: item.y + 'px', left: item.x + 'px', cursor: 'move' }" @mousedown="startDrag">
        <div v-if="item.type === 'text'">{{ item.content }}</div>
        <img v-else :src="item.src" style="max-width: 100px; max-height: 100px;" />
        <button class="btn btn-sm btn-danger position-absolute top-0 end-0" @click="$emit('delete', item.id)">x</button>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({ item: Object })
const emit = defineEmits(['delete'])

function startDrag(e) {
    const offsetX = e.offsetX
    const offsetY = e.offsetY

    const canvasRect = e.target.closest('.canvas-content').getBoundingClientRect()
    const itemRect = e.target.getBoundingClientRect()

    function onMouseMove(ev) {
        // Calculate the new position
        let newX = ev.clientX - canvasRect.left - offsetX
        let newY = ev.clientY - canvasRect.top - offsetY

        // Ensure the item stays within the canvas boundaries
        newX = Math.max(0, Math.min(newX, canvasRect.width - itemRect.width))
        newY = Math.max(0, Math.min(newY, canvasRect.height - itemRect.height))

        // Update the item's position
        props.item.x = newX
        props.item.y = newY
    }

    function onMouseUp() {
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
}
</script>