import ScreenerTable from "@/components/screener/ScreenerTable";


export default function ScreenerPage() {

    return (
        <div className="flex flex-col gap-4">

            <h1 className="text-xl font-semibold text-center">
                Crypto Screener
            </h1>

            <ScreenerTable/>

        </div>
    );
}
