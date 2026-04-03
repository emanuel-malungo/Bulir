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
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </main>
                     {/* Footer fixo na base */}
            <footer className="fixed bottom-0 left-56 right-0 border-t border-gray-200 px-6 py-4 bg-white z-40">
              <div className="flex items-center justify-between">
                {/* Esquerda */}
                <p className="text-xs text-gray-500">© 2026 Bulir - Todos os direitos reservados</p>
                
                {/* Direita */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Check className="w-4 h-4 text-accent" />
                    <span className="text-xs text-gray-600">Verificado</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Check className="w-4 h-4 text-accent" />
                    <span className="text-xs text-gray-600">Confiável</span>
                  </div>
                </div>
              </div>
            </footer>
                </div>
            </div>

           
        </div>
    )
}
