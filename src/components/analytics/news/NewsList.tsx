"use client";

import NewsCard from "./NewsCard";
import { NewsItem } from "@/lib/news/types";

export default function NewsList({ news }: { news: NewsItem[] }) {

    if (!news.length) {

        return (
            <div className="w-full py-16 text-center text-[var(--color-text-muted)]">
                No news found
            </div>
        )

    }

    return (

        <div
            className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            gap-5
            "
        >

            {news.map((item) => (

                <NewsCard
                    key={item.url}
                    news={item}
                />

            ))}

        </div>

    )

}