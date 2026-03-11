"use client";

import { useEffect, useState } from "react"
import { useNews } from "@/hooks/useNews"

import Pagination from "@/components/elements/Pagination"
import NewsSearch from "@/components/analytics/news/NewsSearch";
import NewsFilters from "@/components/analytics/news/NewsFilters";
import NewsList from "@/components/analytics/news/NewsList";

export default function NewsPage(){

    const limit = 20

    const {news,totalItems,fetchNews} = useNews(limit)

    const [filters,setFilters] = useState({

        page:1,
        search:"",
        category:"all",
        language:"all"

    })

    useEffect(()=>{

        fetchNews(filters)

    },[filters])

    return(

        <div className="min-h-screen flex flex-col gap-6">

            <NewsSearch
                value={filters.search}
                onChange={(v)=>setFilters(prev=>({...prev,search:v}))}
                onSearch={()=>setFilters(prev=>({...prev,page:1}))}
            />

            <NewsFilters
                category={filters.category}
                language={filters.language}
                onCategory={(v)=>setFilters(prev=>({...prev,category:v,page:1}))}
                onLanguage={(v)=>setFilters(prev=>({...prev,language:v,page:1}))}
            />

            <NewsList news={news}/>

            <Pagination
                limit={limit}
                totalItems={totalItems}
                onPageChange={(p)=>setFilters(prev=>({...prev,page:p}))}
            />

        </div>

    )

}