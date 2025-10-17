import Sidebar from "@/components/Sidebar";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LangSwitcher from "@/components/LangSwitcher";

export default function Home() {
    return (
        <div className="min-h-screen bg-background text-text">
            <div className="bg-card border border-border">
                APP
                <div className="mt-4 flex gap-3">
                    <LangSwitcher />
                    <ThemeSwitcher />
                </div>
                <div className="mt-6">
                    <Sidebar />
                </div>
            </div>
        </div>
    );
}
