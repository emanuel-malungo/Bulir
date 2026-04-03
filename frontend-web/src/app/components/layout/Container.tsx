import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Container({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex ">
            {/* Sidebar - Full Height esquerda */}
            <Sidebar />
            
            {/* Lado direito - Header e Main */}
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-white">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
