<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
            <h2>Upload New Image</h2>

            <form @submit.prevent="handleSubmit" class="upload-form">
                <div class="form-group">
                    <label for="name">Record Name:</label>
                    <input id="name" v-model="name" required placeholder="Enter a name..." />
                </div>

                <div class="drop-zone" :class="{ 'is-dragging': isDragging }" @dragover.prevent="isDragging = true"
                    @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop" @click="$refs.fileInput.click()">
                    <input type="file" accept="image/jpeg, image/png, image/jpg" hidden ref="fileInput"
                        @change="handleFileSelect" />

                    <div v-if="previewUrl" class="preview-container">
                        <img :src="previewUrl" alt="Preview" class="preview-img" />
                        <p class="change-text">Click or drop to change image</p>
                    </div>
                    <div v-else class="empty-drop">
                        <p>📁 Drag & Drop an image here</p>
                        <p class="sub-text">or click to browse (JPG, PNG)</p>
                    </div>
                </div>

                <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

                <div class="actions">
                    <button type="button" @click="$emit('close')" class="btn-cancel">Cancel</button>
                    <button type="submit" class="btn-submit" :disabled="!file || !name || isUploading">
                        {{ isUploading ? 'Uploading...' : 'Upload File' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['close', 'success'])

const name = ref('')
const file = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const isDragging = ref(false)
const isUploading = ref(false)
const errorMessage = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

// Cleanup object URL to prevent memory leaks
onUnmounted(() => {
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})

const processFile = (selectedFile: File) => {
    errorMessage.value = ''
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(selectedFile.type)) {
        errorMessage.value = 'Only JPG and PNG files are allowed.'
        return
    }
    file.value = selectedFile
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = URL.createObjectURL(selectedFile)
}

const handleDrop = (event: DragEvent) => {
    isDragging.value = false
    if (event.dataTransfer?.files.length) {
        processFile(event.dataTransfer.files[0])
    }
}

const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files?.length) {
        processFile(target.files[0])
    }
}

const handleSubmit = async () => {
    if (!file.value || !name.value) return
    isUploading.value = true
    errorMessage.value = ''

    const formData = new FormData()
    formData.append('name', name.value)
    formData.append('file', file.value)

    try {
        await $fetch('/api/records', {
            method: 'POST',
            body: formData
        })
        emit('success')
        emit('close')
    } catch (error: any) {
        errorMessage.value = error.data?.message || 'Upload failed'
    } finally {
        isUploading.value = false
    }
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
}

.modal-content {
    background: var(--nav-bg);
    padding: 2rem;
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 1.5rem;
}

.form-group input {
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    margin-top: 0.5rem;
    background: var(--bg-color);
    color: var(--text-color);
}

.drop-zone {
    border: 2px dashed #9ca3af;
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    background: var(--bg-color);
    margin-bottom: 1.5rem;
}

.drop-zone.is-dragging {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
}

.preview-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.preview-img {
    max-width: 100%;
    max-height: 200px;
    border-radius: 6px;
    object-fit: contain;
}

.change-text {
    font-size: 0.8rem;
    opacity: 0.7;
    margin-top: 0.5rem;
}

.sub-text {
    font-size: 0.85rem;
    opacity: 0.6;
}

.error {
    color: #ef4444;
    margin-bottom: 1rem;
    font-size: 0.9rem;
}

.actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}

.btn-cancel,
.btn-submit {
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-weight: bold;
}

.btn-cancel {
    background: transparent;
    color: var(--text-color);
    border: 1px solid #d1d5db;
}

.btn-submit {
    background: #3b82f6;
    color: white;
}

.btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>