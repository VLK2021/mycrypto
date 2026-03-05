import AnalyticsHeader from "@/components/analytics/AnalyticsHeader";


export default function AnalyticsLayout({children}: {
    children: React.ReactNode;
}) {

    return (
        <div
            className="min-h-screen text-[var(--color-text)] bg-[var(--color-background)] py-3 flex flex-col gap-4"
        >
            <AnalyticsHeader />

            {children}
        </div>
    );
}
