// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['nuxt-auth-utils'],
    runtimeConfig: {
        session: {
            password: process.env.NUXT_SESSION_PASSWORD || 'password-at-least-32-chars-long'
        }
    }
})