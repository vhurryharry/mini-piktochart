<template>
    <div class="image">
        <h4>Images</h4>
        <ul class="list-unstyled">
            <li v-for="image in images" :key="image" class="mb-2">
                <img :src="`${image}`" class="img-fluid" @click="$emit('select-image', image)"
                    style="cursor: pointer;" />
            </li>
        </ul>
    </div>
</template>

<script setup>
defineProps({ images: Array })
</script>