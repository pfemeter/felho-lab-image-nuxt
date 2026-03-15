<template>
    <div class="dashboard-wrapper">
        <section class="list-section">
            <div class="header-controls">
                <div class="header-title-group">
                    <h2>Gallery</h2>
                    <button v-if="loggedIn" @click="isUploadModalOpen = true" class="btn-new">
                        + Upload New File
                    </button>
                    <NuxtLink v-else to="/login" class="btn-login-link">
                        Login to Upload
                    </NuxtLink>
                </div>

                <div class="sort-control">
                    <label for="sort">Order by:</label>
                    <select id="sort" v-model="sortBy" class="sort-select">
                        <option value="uploadDateTime">Upload Date</option>
                        <option value="name">Name</option>
                    </select>
                </div>
            </div>

            <div v-if="status === 'pending'" class="loading">Loading records...</div>

            <div v-else class="records-list">
                <RecordListItem v-for="record in records" :key="record.id" :record="record"
                    :isSelected="selectedRecord?.id === record.id" @click="selectedRecord = record" />
            </div>
        </section>

        <aside class="detail-section">
            <div class="detail-card" v-if="selectedRecord">
                <div class="detail-header">
                    <h2>{{ selectedRecord.name }}</h2>
                    <button v-if="loggedIn && user?.id === selectedRecord.userId"
                        @click="handleDelete(selectedRecord.id)" class="btn-delete">
                        Delete
                    </button>
                </div>
                <div class="image-container">
                    <img :src="`/api/images/${selectedRecord.id}`" :alt="selectedRecord.name" loading="lazy" />
                </div>
                <p class="meta">Uploaded on {{ new Date(selectedRecord.uploadDateTime).toLocaleDateString() }}</p>
            </div>

            <div class="empty-placeholder" v-else>
                <p>Select an image to view details.</p>
            </div>
        </aside>

        <RecordUploadModal v-if="isUploadModalOpen" @close="isUploadModalOpen = false" @success="refresh" />
    </div>
</template>

<script setup lang="ts">
// No auth middleware - this page is public!
const { loggedIn, user } = useUserSession()
const sortBy = ref<'uploadDateTime' | 'name'>('uploadDateTime')
const isUploadModalOpen = ref(false)
const selectedRecord = ref<any>(null)

const { data: records, status, refresh } = await useFetch('/api/images', {
    query: { sortBy }
})

const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
        await $fetch(`/api/images/${id}`, { method: 'DELETE' })
        selectedRecord.value = null
        await refresh()
    } catch (e) {
        alert('Failed to delete image.')
    }
}
</script>

<style scoped>
.dashboard-wrapper {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
    width: 100%;
    max-width: 1200px;
    align-items: start;
}

.header-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.header-title-group {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.btn-new {
    background: #10b981;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-new:hover {
    background: #059669;
}

.sort-select {
    margin-left: 0.5rem;
    padding: 0.5rem;
    border-radius: 6px;
    border: 1px solid #d1d5db;
    background-color: var(--nav-bg);
    color: var(--text-color);
}

.detail-card {
    background-color: var(--nav-bg);
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 2rem;
}

.image-container img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    margin-top: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.empty-placeholder {
    background-color: var(--nav-bg);
    padding: 3rem 2rem;
    border-radius: 12px;
    border: 2px dashed #9ca3af;
    text-align: center;
    color: #9ca3af;
    position: sticky;
    top: 2rem;
}

@media (max-width: 768px) {
    .dashboard-wrapper {
        grid-template-columns: 1fr;
    }

    .header-controls {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
}

.detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.btn-delete {
    background: #ef4444;
    color: white;
    border: none;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
}

.btn-login-link {
    font-size: 0.9rem;
    color: #3b82f6;
    text-decoration: none;
}

.meta {
    font-size: 0.8rem;
    opacity: 0.6;
    margin-top: 1rem;
}
</style>