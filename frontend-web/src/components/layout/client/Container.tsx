
'use client';

import { useState } from 'react';
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Check } from "lucide-react";

export default function Container({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50/50">
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

                    {/* Footer fixo na base */}
                    <footer className="fixed bottom-0 left-0 md:left-64 right-0 border-t border-gray-200 px-6 py-4 bg-white/80 backdrop-blur-md z-40">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Esquerda */}
                        <p className="text-xs text-gray-400 font-medium">© 2026 Bulir — Todos os direitos reservados</p>
                        
                        {/* Direita */}
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-1.5 group">
                            <div className="p-0.5 bg-accent/10 rounded-full group-hover:bg-accent/20 transition-colors">
                              <Check className="w-3.5 h-3.5 text-accent" />
                            </div>
                            <span className="text-xs text-gray-500 font-medium">Verificado</span>
                          </div>
                          <div className="flex items-center space-x-1.5 group">
                            <div className="p-0.5 bg-accent/10 rounded-full group-hover:bg-accent/20 transition-colors">
                              <Check className="w-3.5 h-3.5 text-accent" />
                            </div>
                            <span className="text-xs text-gray-500 font-medium">Confiável</span>
                          </div>
                        </div>
                      </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}
