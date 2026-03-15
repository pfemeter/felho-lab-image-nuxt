<template>
    <div class="auth-container">
        <div class="auth-card">
            <h1 class="title">{{ isLogin ? 'Login' : 'Register' }}</h1>
            <form @submit.prevent="handleSubmit" class="auth-form">
                <div class="input-group">
                    <label>Username</label>
                    <input v-model="formData.username" required />
                </div>
                <div class="input-group">
                    <label>Password</label>
                    <input v-model="formData.password" type="password" required />
                </div>
                <button type="submit" :disabled="isLoading" class="submit-btn">
                    {{ isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account') }}
                </button>
            </form>
            <button @click="isLogin = !isLogin" class="toggle-btn">
                {{ isLogin ? "Need an account? Register" : "Have an account? Login" }}
            </button>
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
        await refreshSession() // Refresh the nuxt-auth-utils state
        await navigateTo('/')
    } catch (e: any) {
        alert(e.data?.statusMessage || 'Auth failed')
    } finally {
        isLoading.value = false
    }
}
</script>

<style scoped>
.auth-card {
    background-color: var(--nav-bg);
    padding: 2.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
}

.title {
    text-align: center;
    margin-top: 0;
    margin-bottom: 1.5rem;
}

.auth-form {
    display: flex;
    flex-direction: column;
}

.submit-btn {
    background-color: #3b82f6;
    color: white;
    padding: 0.75rem;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    margin-top: 1rem;
    transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
    background-color: #2563eb;
}

.submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.toggle-mode {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 0.9rem;
}

.text-btn {
    background: none;
    border: none;
    color: #3b82f6;
    font-weight: bold;
    cursor: pointer;
    padding: 0;
    text-decoration: underline;
}

.error-msg {
    color: #ef4444;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
}

.success-msg {
    color: #10b981;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
}
</style>