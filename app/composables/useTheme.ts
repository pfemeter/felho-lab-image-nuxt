export const useTheme = () => {
    const theme = useState<'light' | 'dark'>('theme', () => 'light')

    const toggleTheme = () => {
        theme.value = theme.value === 'light' ? 'dark' : 'light'
        if (import.meta.client) {
            document.documentElement.setAttribute('data-theme', theme.value)
        }
    }

    // Set initial theme based on user preference on the client side
    if (import.meta.client && theme.value === 'light') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        if (prefersDark) {
            theme.value = 'dark'
            document.documentElement.setAttribute('data-theme', 'dark')
        }
    }

    return { theme, toggleTheme }
}