"use client";

export default function NewsFilters({
                                        category,
                                        language,
                                        onCategory,
                                        onLanguage
                                    }:{
    category:string
    language:string
    onCategory:(v:string)=>void
    onLanguage:(v:string)=>void
}){

    return(

        <div className="flex flex-wrap gap-3">

            <select
                value={category}
                onChange={(e)=>onCategory(e.target.value)}
                className="px-3 py-2 rounded-md border text-sm"
                style={{
                    backgroundColor:"var(--color-card)",
                    borderColor:"var(--color-border)"
                }}
            >

                <option value="all">All</option>
                <option value="crypto">Crypto</option>
                <option value="finance">Finance</option>
                <option value="tech">Tech</option>

            </select>

            <select
                value={language}
                onChange={(e)=>onLanguage(e.target.value)}
                className="px-3 py-2 rounded-md border text-sm"
                style={{
                    backgroundColor:"var(--color-card)",
                    borderColor:"var(--color-border)"
                }}
            >

                <option value="all">All languages</option>
                <option value="ua">UA / RU</option>
                <option value="en">English</option>

            </select>

        </div>

    )

}