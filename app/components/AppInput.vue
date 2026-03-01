<template>
    <div class="input-group">
        <label :for="id" class="label">{{ label }}</label>
        <input :id="id" :type="type" v-model="model" :placeholder="placeholder" class="input-field" required />
    </div>
</template>

<script setup lang="ts">
const model = defineModel<string>()

withDefaults(defineProps<{
    id: string
    label: string
    type?: string
    placeholder?: string
}>(), {
    type: 'text',
    placeholder: ''
})
</script>

<style scoped>
.input-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    width: 100%;
}

.label {
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
}

.input-field {
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background-color: var(--nav-bg);
    color: var(--text-color);
    font-size: 1rem;
    transition: border-color 0.2s;
}

.input-field:focus {
    outline: none;
    border-color: #3b82f6;
}
</style>