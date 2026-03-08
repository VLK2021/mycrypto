import {ReactNode} from "react";
import RsiHeader from "@/components/analytics/RsiHeader";


export default function RsiLayout({ children }: { children: ReactNode }) {
    return(
        <div
            className="min-h-screen text-[var(--color-text)] bg-[var(--color-background)] py-3 flex flex-col gap-4"
        >
            <RsiHeader/>

            {children}
        </div>
    )
}