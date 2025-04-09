<template>
    <div class="text">
        <h4>Text</h4>
        <input v-model="text" id="addTextInput" type="text" class="form-control" />
        <button id="addText" class="btn btn-info btn-block mt-2" @click="$emit('add', text)">Add Text</button>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const text = ref('')
</script>