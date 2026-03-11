import NewsCard from "./NewsCard"
import {NewsItem} from "@/lib/news/types";

export default function NewsList({ news }: { news: NewsItem[] }) {

    return (

        <div
            className="
      grid
      gap-4
      sm:grid-cols-2
      xl:grid-cols-3
      "
        >

            {news.map((n) => (
                <NewsCard key={n.id} news={n} />
            ))}

        </div>

    )

}