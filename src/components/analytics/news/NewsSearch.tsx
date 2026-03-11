"use client";

export default function NewsSearch({
                                       value,
                                       onChange,
                                       onSearch
                                   }:{
    value:string
    onChange:(v:string)=>void
    onSearch:()=>void
}){

    return(

        <div className="flex gap-2">

            <input
                value={value}
                onChange={(e)=>onChange(e.target.value)}
                placeholder="Search news..."
                className="px-3 py-2 rounded-md border text-sm w-64"
                style={{
                    backgroundColor:"var(--color-card)",
                    borderColor:"var(--color-border)"
                }}
            />

            <button
                onClick={onSearch}
                className="px-4 py-2 rounded-md text-sm"
                style={{
                    backgroundColor:"var(--color-brand)",
                    color:"#fff"
                }}
            >
                Search
            </button>

        </div>

    )
}