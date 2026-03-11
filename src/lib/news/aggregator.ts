import Parser from "rss-parser"
import { RSS_SOURCES } from "./sources"
import { NewsItem } from "./types"
import { detectLanguage } from "./detectLanguage"
import { detectCategory } from "./detectCategory"

const parser = new Parser()

let cache: NewsItem[] = []
let lastUpdate = 0

const CACHE_TIME = 1000 * 60 * 10

function normalize(item: any, source: string): NewsItem {

    const title = item.title || ""
    const description = item.contentSnippet || ""

    return {

        id: item.link,

        title,

        description,

        url: item.link,

        image: item.enclosure?.url || "",

        source,

        category: detectCategory(title + description),

        language: detectLanguage(title + description),

        publishedAt: new Date(item.pubDate || Date.now()).getTime()

    }
}

async function fetchRSS(url: string) {

    try {

        const feed = await parser.parseURL(url)

        return feed.items.map(item =>
            normalize(item, feed.title || "RSS")
        )

    } catch {

        return []

    }

}

export async function getNews(): Promise<NewsItem[]> {

    if (Date.now() - lastUpdate < CACHE_TIME) {
        return cache
    }

    const results: NewsItem[] = []

    for (const source of RSS_SOURCES) {

        const news = await fetchRSS(source.url)

        results.push(...news)

    }

    const unique = new Map()

    for (const n of results) {
        if (!unique.has(n.url)) unique.set(n.url, n)
    }

    cache = Array.from(unique.values())

    lastUpdate = Date.now()

    return cache
}