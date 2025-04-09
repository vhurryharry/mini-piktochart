<template>
    <div class="sidepane h-100 bg-dark text-white col-2">
        <Uploader @uploaded="refreshImages" />
        <div class="assets w-100 mt-5">
            <h3>Assets</h3>
            <hr />
            <TextInput @add="$emit('add-text', $event)" />
            <ImageList :images="images" @select-image="$emit('add-image', $event)" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Uploader from './Uploader.vue'
import TextInput from './TextInput.vue'
import ImageList from './ImageList.vue'

const images = ref([])

async function refreshImages() {
    try {
        const res = await fetch('/images')
        images.value = await res.json()
    } catch (e) {
        console.error('Failed to load images:', e)
    }
}

onMounted(refreshImages)
</script>