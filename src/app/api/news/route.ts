import { NextRequest, NextResponse } from "next/server"
import { getNews } from "@/lib/news/aggregator"

export async function GET(req: NextRequest) {

    const { searchParams } = new URL(req.url)

    const search = searchParams.get("search")?.toLowerCase() || ""
    const category = searchParams.get("category")
    const language = searchParams.get("language") || "all"
    const sort = searchParams.get("sort") || "latest"

    const page = Number(searchParams.get("page") || 1)
    const limit = Number(searchParams.get("limit") || 20)

    let news = await getNews()

    if (search) {

        news = news.filter(n =>
            n.title.toLowerCase().includes(search) ||
            n.description.toLowerCase().includes(search)
        )

    }

    if (category && category !== "all") {

        news = news.filter(n => n.category === category)

    }

    if (language !== "all") {

        if (language === "ua") {

            news = news.filter(n =>
                n.language === "uk" || n.language === "ru"
            )

        } else {

            news = news.filter(n => n.language === language)

        }

    }

    if (sort === "latest") {

        news.sort((a, b) => b.publishedAt - a.publishedAt)

    }

    const total = news.length

    const start = (page - 1) * limit
    const end = start + limit

    const paginated = news.slice(start, end)

    return NextResponse.json({

        totalItems: total,

        page,

        limit,

        news: paginated

    })

}