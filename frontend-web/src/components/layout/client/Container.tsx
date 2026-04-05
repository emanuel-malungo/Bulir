
'use client';

import { useState } from 'react';
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Container({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <div className="flex flex-1">
                {/* Sidebar */}
                <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
                
                {/* Lado direito - Header e Main */}
                <div className="flex-1 flex flex-col min-w-0">
                    <Header onMenuClick={toggleSidebar} />
                    
                    <main className="flex-1 mt-16 p-4 md:p-8 md:pl-8 overflow-y-auto pb-32">
                        <div className="max-w-6xl mx-auto w-full">
                            {children}
                        </div>
                    </main>

                </div>
            </div>
        </div>
    );
}
