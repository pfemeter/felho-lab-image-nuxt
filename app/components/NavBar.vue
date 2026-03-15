<template>
    <nav class="navbar">
        <div class="logo-group">
            <NuxtLink to="/" class="logo">
                <strong>My Nuxt 4 App</strong>
            </NuxtLink>
        </div>

        <div class="nav-actions">
            <button @click="toggleTheme" class="theme-toggle" aria-label="Toggle dark mode">
                {{ theme === 'light' ? '🌙' : '☀️' }}
            </button>

            <div v-if="loggedIn" class="user-controls">
                <span class="username">Hi, {{ user?.username }}</span>
                <button @click="handleLogout" class="btn-auth btn-logout">
                    Logout
                </button>
            </div>
            <NuxtLink v-else to="/login" class="btn-auth btn-login">
                Login
            </NuxtLink>
        </div>
    </nav>
</template>

<script setup lang="ts">
const { theme, toggleTheme } = useTheme()
const { loggedIn, user, clear } = useUserSession()

const handleLogout = async () => {
    await clear()
}
</script>

<style scoped>
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: var(--nav-bg);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
    text-decoration: none;
    color: inherit;
    font-size: 1.2rem;
}

.nav-actions {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.user-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.username {
    font-size: 0.9rem;
    font-weight: 500;
    opacity: 0.9;
}

.btn-auth {
    padding: 0.5rem 1.25rem;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    text-decoration: none;
    transition: transform 0.1s;
}

.btn-auth:active {
    transform: scale(0.95);
}

.btn-login {
    background-color: #3b82f6;
    color: white;
}

.btn-logout {
    background: transparent;
    border: 1px solid #ef4444;
    color: #ef4444;
}

.btn-logout:hover {
    background-color: #ef4444;
    color: white;
}

.theme-toggle {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
}
</style>