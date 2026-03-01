<template>
    <nav class="navbar">
        <div class="logo">
            <strong>My Nuxt 4 App</strong>
        </div>
        <button @click="toggleTheme" class="theme-toggle" aria-label="Toggle dark mode">
            {{ theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode' }}
        </button>
    </nav>
</template>

<script setup lang="ts">
const { theme, toggleTheme } = useTheme()
</script>

<style scoped>
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: var(--nav-bg);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease;
}

.theme-toggle {
    background: var(--btn-bg);
    color: var(--btn-text);
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s ease;
}

.theme-toggle:hover {
    opacity: 0.8;
}
</style>