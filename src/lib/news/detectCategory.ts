export function detectCategory(text: string) {

    const t = text.toLowerCase()

    if (
        t.includes("bitcoin") ||
        t.includes("crypto") ||
        t.includes("blockchain") ||
        t.includes("btc")
    )
        return "crypto"

    if (
        t.includes("stock") ||
        t.includes("market") ||
        t.includes("bank") ||
        t.includes("economy")
    )
        return "finance"

    if (
        t.includes("ai") ||
        t.includes("technology") ||
        t.includes("startup")
    )
        return "tech"

    return "general"
}