export default defineNuxtRouteMiddleware((to, from) => {
    const { isAuthenticated } = useAuth()

    // If the user is logged in and tries to access the login/register page
    if (isAuthenticated.value && to.path === '/') {
        return navigateTo('/dashboard')
    }

    // If the user is NOT logged in and tries to access any other protected page
    if (!isAuthenticated.value && to.path !== '/') {
        return navigateTo('/')
    }
})