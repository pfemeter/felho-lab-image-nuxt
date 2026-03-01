<template>
    <div class="app-wrapper">
        <NavBar />

        <main class="main-content">
            <NuxtPage />
        </main>
    </div>
</template>

<script setup lang="ts">
// Global head configuration can go here if needed
</script>

<style>
/* Global CSS variables for seamless theming */
:root {
    --bg-color: #f3f4f6;
    /* Generic light background */
    --text-color: #1f2937;
    --nav-bg: #ffffff;
    --btn-bg: #374151;
    --btn-text: #ffffff;
}

:root[data-theme="dark"] {
    --bg-color: #111827;
    /* Generic dark background */
    --text-color: #f9fafb;
    --nav-bg: #1f2937;
    --btn-bg: #f3f4f6;
    --btn-text: #111827;
}

body {
    margin: 0;
    font-family: system-ui, -apple-system, sans-serif;
    background-color: var(--bg-color);
    color: var(--text-color);
    transition: background-color 0.3s ease, color 0.3s ease;
}

.app-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* Vertically centers the content */
    align-items: center;
    /* Horizontally centers the content */
    padding: 2rem;
}
</style>