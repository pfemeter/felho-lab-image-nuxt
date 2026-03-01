<template>
    <div class="auth-card">
        <h1 class="title">{{ isLogin ? 'Welcome Back' : 'Create an Account' }}</h1>

        <form @submit.prevent="handleSubmit" class="auth-form">
            <AppInput id="username" label="Username" v-model="formData.username" placeholder="Enter your username" />

            <AppInput id="password" label="Password" type="password" v-model="formData.password"
                placeholder="Enter your password" />

            <AppInput v-if="!isLogin" id="confirmPassword" label="Confirm Password" type="password"
                v-model="formData.confirmPassword" placeholder="Confirm your password" />

            <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
            <p v-if="successMessage" class="success-msg">{{ successMessage }}</p>

            <button type="submit" class="submit-btn" :disabled="isLoading">
                {{ isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Register') }}
            </button>
        </form>

        <div class="toggle-mode">
            <p>
                {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
                <button @click="toggleMode" class="text-btn">
                    {{ isLogin ? 'Register here' : 'Login here' }}
                </button>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ['auth']
})

const isLogin = ref(true)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const formData = reactive({
    username: '',
    password: '',
    confirmPassword: ''
})

const toggleMode = () => {
    isLogin.value = !isLogin.value
    errorMessage.value = ''
    successMessage.value = ''
    formData.password = ''
    formData.confirmPassword = ''
}

const handleSubmit = async () => {
    errorMessage.value = ''
    successMessage.value = ''

    if (!isLogin.value && formData.password !== formData.confirmPassword) {
        errorMessage.value = "Passwords do not match!"
        return
    }

    isLoading.value = true

    try {
        const response = await $fetch<{ message: string }>('/api/auth', {
            method: 'POST',
            body: {
                action: isLogin.value ? 'login' : 'register',
                username: formData.username,
                password: formData.password
            }
        })

        successMessage.value = response.message

        if (!isLogin.value) {
            setTimeout(() => {
                isLogin.value = true
                formData.password = ''
                formData.confirmPassword = ''
                successMessage.value = ''
            }, 2000)
        } else {
            await navigateTo('/dashboard')
        }

    } catch (error: any) {
        errorMessage.value = error.data?.message || 'Something went wrong.'
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