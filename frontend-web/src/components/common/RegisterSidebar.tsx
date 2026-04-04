import Image from 'next/image';
import icon from '@/assets/images/bulir.svg';
import solved from '@/assets/images/puzzle-solved.svg';

export default function RegisterSidebar() {
  return (
    <div className="hidden lg:flex lg:w-1/2  flex-col items-center p-12 relative overflow-hidden">
      <div className="max-w-md text-left space-y-4 relative z-10">
        <div>
          <Image src={icon} alt="Bulir" width={40} height={40} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Por que se cadastrar?</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center mt-0.5 shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
              </div>
              <span className="text-sm text-gray-700">Encontre profissionais qualificados</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center mt-0.5 shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
              </div>
              <span className="text-sm text-gray-700">Gerencie tudo em um único lugar</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center mt-0.5 shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
              </div>
              <span className="text-sm text-gray-700">Agendamentos automáticos</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center mt-0.5 shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
              </div>
              <span className="text-sm text-gray-700">Multiplique suas oportunidades</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 opacity-20">
        <Image src={solved} alt="Ilustração de solução" width={300} height={300} />
      </div>
    </div>
  );
}
