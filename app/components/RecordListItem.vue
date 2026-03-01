<template>
    <div class="record-item" :class="{ 'is-selected': isSelected }">
        <div class="content">
            <h3 class="name">{{ record.name }}</h3>
            <span class="date">Uploaded: {{ formattedDate }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    record: { id: string; name: string; uploadDateTime: string; fileId: string }
    isSelected: boolean
}>()

const formattedDate = computed(() => {
    const date = new Date(props.record.uploadDateTime)
    return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
})
</script>

<style scoped>
.record-item {
    padding: 1rem 1.5rem;
    background-color: var(--nav-bg);
    border: 1px solid transparent;
    border-radius: 8px;
    margin-bottom: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.record-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.record-item.is-selected {
    border-color: #3b82f6;
    background-color: rgba(59, 130, 246, 0.05);
}

.name {
    margin: 0 0 0.25rem 0;
    font-size: 1.1rem;
}

.date {
    font-size: 0.85rem;
    opacity: 0.7;
}
</style>