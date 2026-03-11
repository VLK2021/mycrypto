"use client";


import {NewsItem} from "@/lib/news/types";

function timeAgo(timestamp: number) {
    const diff = Date.now() - timestamp;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
}

export default function NewsCard({ news }: { news: NewsItem }) {

    return (

        <a
            href={news.url}
            target="_blank"
            className="
      group
      rounded-xl
      overflow-hidden
      border
      transition
      hover:shadow-lg
      hover:-translate-y-[2px]
      flex flex-col
      "
            style={{
                backgroundColor: "var(--color-card)",
                borderColor: "var(--color-border)"
            }}
        >

            {/* IMAGE */}

            <div
                className="w-full h-[150px] overflow-hidden"
                style={{
                    background: "linear-gradient(135deg,#0f172a,#1e293b)"
                }}
            >

                {news.image ? (

                    <img
                        src={news.image}
                        alt={news.title}
                        className="
            w-full
            h-full
            object-cover
            group-hover:scale-105
            transition
            duration-300
            "
                    />

                ) : (

                    <div
                        className="
            w-full
            h-full
            flex
            items-center
            justify-center
            text-xs
            opacity-50
            "
                    >
                        NEWS
                    </div>

                )}

            </div>

            {/* CONTENT */}

            <div className="p-4 flex flex-col gap-2">

                {/* TITLE */}

                <div
                    className="
          text-sm
          font-semibold
          leading-snug
          line-clamp-2
          group-hover:text-[var(--color-brand)]
          transition
          "
                >
                    {news.title}
                </div>

                {/* DESCRIPTION */}

                <div
                    className="
          text-xs
          opacity-70
          line-clamp-2
          "
                >
                    {news.description}
                </div>

                {/* FOOTER */}

                <div
                    className="
          flex
          items-center
          justify-between
          text-xs
          pt-2
          opacity-70
          "
                >

          <span>
            {news.source}
          </span>

                    <span>
            {timeAgo(news.publishedAt)}
          </span>

                </div>

            </div>

        </a>

    );
}