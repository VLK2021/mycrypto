"use client";

import { useState } from "react";
import {NewsItem} from "@/lib/news/types";

export function useNews(limit = 20) {

    const [news, setNews] = useState<NewsItem[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNews = async ({
                                 page = 1,
                                 search = "",
                                 category = "all",
                                 language = "all",
                             }: {
        page?: number
        search?: string
        category?: string
        language?: string
    }) => {

        setLoading(true)

        const params = new URLSearchParams()

        params.set("page", String(page))
        params.set("limit", String(limit))

        if (search) params.set("search", search)
        if (category !== "all") params.set("category", category)
        if (language !== "all") params.set("language", language)

        const res = await fetch(`/api/news?${params}`)

        const data = await res.json()

        setNews(data.news)
        setTotalItems(data.totalItems)

        setLoading(false)
    }

    return {
        news,
        totalItems,
        loading,
        fetchNews
    }
}