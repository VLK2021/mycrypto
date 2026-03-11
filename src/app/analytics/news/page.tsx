"use client";

import { useEffect, useState } from "react";
import { useNews } from "@/hooks/useNews";

import Pagination from "@/components/elements/Pagination";
import NewsSearch from "@/components/analytics/news/NewsSearch";
import NewsFilters from "@/components/analytics/news/NewsFilters";
import NewsList from "@/components/analytics/news/NewsList";

export default function NewsPage() {

    const limit = 20;

    const { news, totalItems, loading, fetchNews } = useNews(limit);

    const [filters, setFilters] = useState({
        page: 1,
        search: "",
        category: "all",
        language: "all"
    });

    useEffect(() => {
        fetchNews(filters);
    }, [filters]);


    function changeSearch(value: string) {

        setFilters(prev => ({
            ...prev,
            search: value,
            page: 1
        }));

    }


    function changeCategory(value: string) {

        setFilters(prev => ({
            ...prev,
            category: value,
            page: 1
        }));

    }


    function changeLanguage(value: string) {

        setFilters(prev => ({
            ...prev,
            language: value,
            page: 1
        }));

    }


    function changePage(page: number) {

        setFilters(prev => ({
            ...prev,
            page
        }));

    }


    return (

        <div className="min-h-screen flex flex-col gap-6">

            <NewsSearch
                value={filters.search}
                onChange={changeSearch}
                onSearch={() => changeSearch(filters.search)}
            />

            <NewsFilters
                category={filters.category}
                language={filters.language}
                onCategory={changeCategory}
                onLanguage={changeLanguage}
            />

            {loading ? (

                <div className="w-full flex justify-center py-16 text-[var(--color-text-muted)]">
                    Loading news...
                </div>

            ) : (

                <NewsList news={news} />

            )}

            <Pagination
                key={`${filters.category}-${filters.language}-${filters.search}`}
                limit={limit}
                totalItems={totalItems}
                onPageChange={(p)=>setFilters(prev=>({...prev,page:p}))}
            />

        </div>

    );
}