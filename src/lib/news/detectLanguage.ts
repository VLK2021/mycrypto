export function detectLanguage(text: string) {

    const t = text.toLowerCase()

    if (/[ієґ]/.test(t)) return "uk"

    if (/[а-я]/.test(t)) return "ru"

    return "en"
}