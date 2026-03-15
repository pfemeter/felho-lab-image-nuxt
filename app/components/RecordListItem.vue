<template>
    <div class="record-item" :class="{ 'is-selected': isSelected }">
        <div class="content">
            <div class="title-row">
                <h3 class="name">{{ record.name }}</h3>
                <span v-if="isOwner" class="owner-badge">Yours</span>
            </div>
            <span class="date">Uploaded: {{ formattedDate }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
const { user } = useUserSession()

const props = defineProps<{
    record: {
        id: string;
        name: string;
        uploadDateTime: string | Date;
        userId: string
    }
    isSelected: boolean
}>()

const isOwner = computed(() => user.value?.id === props.record.userId)

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

.title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.25rem;
}

.name {
    margin: 0;
    font-size: 1.1rem;
}

.owner-badge {
    font-size: 0.7rem;
    background: #10b981;
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    text-transform: uppercase;
    font-weight: bold;
}

.date {
    font-size: 0.85rem;
    opacity: 0.7;
}
</style>