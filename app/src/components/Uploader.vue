<template>
    <div class="form mt-5">
        <h3>Form</h3>
        <hr />
        <div class="input-group">
            <div class="custom-file">
                <input ref="fileInput" id="upload-image-input" name="upload" type="file" class="custom-file-input"
                    accept="image/png, image/jpeg" @change="onFileChange" />
                <!-- <label class="custom-file-label" for="upload-image-input">Choose Image</label> -->
            </div>
            <div class="input-group-append">
                <button class="btn btn-info" type="button" @click="upload">Upload</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const fileInput = ref(null)
const selectedFile = ref(null)
const emit = defineEmits(['uploaded'])

function onFileChange(event) {
    selectedFile.value = event.target.files[0]
}

async function upload() {
    if (!selectedFile.value) return
    const formData = new FormData()
    formData.append('upload', selectedFile.value)

    await fetch('/uploads', {
        method: 'POST',
        body: formData
    })

    selectedFile.value = null
    fileInput.value.value = ''
    emit('uploaded')
}
</script>