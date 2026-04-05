import Header from "./Header";
import Sidebar from "./Sidebar";
import { Check } from "lucide-react";

export default function Container({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex flex-1">
                {/* Sidebar - Full Height esquerda */}
                <Sidebar />
                
                {/* Lado direito - Header e Main */}
                <div className="flex-1 flex flex-col">
                    <Header />
                    <main className="flex-1 mt-16 p-6 md:p-8 overflow-y-auto bg-white pb-24">
                        <div className="max-w-6xl mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}
