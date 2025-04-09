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

    function onMouseMove(ev) {
        props.item.x = ev.clientX - offsetX
        props.item.y = ev.clientY - offsetY
    }

    function onMouseUp() {
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
}
</script>