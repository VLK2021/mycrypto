
import {
    HomePage,
    type HomePageSearchParams,
} from "@/components/tradescope/home";

type TradeScopeProps = {
    searchParams: Promise<HomePageSearchParams>;
};

export default async function TradeScope({
                                             searchParams,
                                         }: TradeScopeProps) {
    const params = await searchParams;

    return (
        <div
            className="
                flex
                min-h-screen
                flex-col
                gap-4
                bg-[var(--color-background)]
                px-1
                py-3
                text-[var(--color-text)]
                md:px-8
            "
        >
            <HomePage searchParams={params} />
        </div>
    );
}
