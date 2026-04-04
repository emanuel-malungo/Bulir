
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
        <div className="min-h-screen flex flex-col bg-gray-50/80">
            <div className="flex flex-1">
                {/* Admin Sidebar */}
                <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
                
                {/* Lado direito - Header e Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                    <Header onMenuClick={toggleSidebar} />
                    
                    <main className="flex-1 mt-16 p-4 md:p-8 lg:p-12 overflow-y-auto pb-32">
                        <div className="max-w-7xl mx-auto w-full">
                            {children}
                        </div>
                    </main>

                    {/* Admin Footer */}
                    <footer className="fixed bottom-0 left-0 md:left-64 right-0 border-t border-gray-200 px-6 py-4 bg-white/90 backdrop-blur-md z-40">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Status Indicativos */}
                        <div className="flex items-center space-x-6">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">© 2026 Bulir Admin Panel</p>
                          <div className="flex items-center space-x-1.5 group">
                            <div className="p-0.5 bg-green-50 rounded-full border border-green-100 group-hover:bg-green-100 transition-colors">
                              <Check className="w-3 h-3 text-green-500" />
                            </div>
                            <span className="text-[10px] text-gray-500 font-bold uppercase">Sistemas Online</span>
                          </div>
                          <div className="hidden md:flex items-center space-x-1.5 group">
                            <div className="p-0.5 bg-accent/5 rounded-full border border-accent/10 group-hover:bg-accent/10 transition-colors">
                              <Shield className="w-3 h-3 text-accent" />
                            </div>
                            <span className="text-[10px] text-gray-500 font-bold uppercase">Segurança Ativa</span>
                          </div>
                        </div>
                        
                        {/* Versão e Localização */}
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-1.5 opacity-60 hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-mono text-gray-500">v1.0.4-beta</span>
                          </div>
                          <div className="h-3 w-px bg-gray-200"></div>
                          <div className="flex items-center space-x-1.5 opacity-60 hover:opacity-100 transition-opacity">
                            <span className="text-[10px] text-gray-400 font-medium">Data Center: Angola/Central</span>
                          </div>
                        </div>
                      </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}
