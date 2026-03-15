export const useAuth = () => {
    const { user, loggedIn, clear } = useUserSession()

    const logout = async () => {
        await clear() // Wipes the session cookie
        await navigateTo('/')
    }

    return {
        user,
        isAuthenticated: loggedIn,
        logout
    }
}