export const useAuth = () => {
    // useCookie binds directly to the cookie set by backend
    const token = useCookie<string | null>('auth_token')

    const isAuthenticated = computed(() => !!token.value)

    const logout = async () => {
        token.value = null
        await navigateTo('/')
    }

    return { token, isAuthenticated, logout }
}