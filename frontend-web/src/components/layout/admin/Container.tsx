
'use client';

import { useState } from 'react';
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Check, Shield } from "lucide-react";

export default function Container({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <div className="flex flex-1">
                {/* Admin Sidebar */}
                <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
                
                {/* Lado direito - Header e Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                    <Header onMenuClick={toggleSidebar} />
                    
                    <main className="flex-1 mt-20 p-4 md:p-8 lg:p-12 overflow-y-auto pb-32">
                        <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-700">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
