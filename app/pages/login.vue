<template>
    <div class="auth-container">
        <div class="auth-card">
            <h1 class="title">{{ isLogin ? 'Login' : 'Register' }}</h1>

            <form @submit.prevent="handleSubmit" class="auth-form">
                <div class="input-group">
                    <label for="username">Username</label>
                    <input id="username" v-model="formData.username" placeholder="Enter your username" required />
                </div>

                <div class="input-group">
                    <label for="password">Password</label>
                    <input id="password" v-model="formData.password" type="password" placeholder="••••••••" required />
                </div>

                <button type="submit" :disabled="isLoading" class="submit-btn">
                    {{ isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account') }}
                </button>
            </form>

            <div class="toggle-container">
                <button @click="isLogin = !isLogin" class="toggle-btn">
                    {{ isLogin ? "Need an account? Register" : "Have an account? Login" }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// Prevent logged-in users from accessing /login
definePageMeta({ middleware: ['guest-only'] })

const { fetch: refreshSession } = useUserSession()
const isLogin = ref(true)
const isLoading = ref(false)
const formData = reactive({ username: '', password: '' })

const handleSubmit = async () => {
    isLoading.value = true
    try {
        await $fetch('/api/auth', {
            method: 'POST',
            body: {
                action: isLogin.value ? 'login' : 'register',
                ...formData
            }
        })
        await refreshSession()
        await navigateTo('/')
    } catch (e: any) {
        alert(e.data?.statusMessage || 'Auth failed')
    } finally {
        isLoading.value = false
    }
}
</script>

<style scoped>
/* Container to center the card on the page */
.auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
}

.auth-card {
    background-color: var(--nav-bg, #ffffff);
    padding: 2.5rem;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
}

.title {
    text-align: center;
    margin-top: 0;
    margin-bottom: 2rem;
    font-size: 1.75rem;
    color: var(--text-color, #1a1a1a);
}

.auth-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

/* Input Styling */
.input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.input-group label {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-muted, #4b5563);
}

.input-group input {
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.2s ease;
    background-color: white;
}

.input-group input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Primary Button */
.submit-btn {
    background-color: #3b82f6;
    color: white;
    padding: 0.8rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    margin-top: 0.5rem;
    transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
    background-color: #2563eb;
}

.submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

/* Toggle Button Styling */
.toggle-container {
    text-align: center;
    margin-top: 1.5rem;
}

.toggle-btn {
    background: none;
    border: none;
    color: #3b82f6;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    padding: 0.5rem;
    text-decoration: none;
    transition: color 0.2s;
}

.toggle-btn:hover {
    color: #2563eb;
    text-decoration: underline;
}
</style>