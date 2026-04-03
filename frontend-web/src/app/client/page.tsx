
import Container from "../components/layout/Container"

export default function ClientDashboard() {
    return (
        <Container>
            <div className="space-y-6">
                {/* Cabeçalho */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Bem-vindo à Bulir!</h1>
                    <p className="text-gray-600 mt-2">Encontre e contrate os melhores profissionais para seus serviços</p>
                </div>

                {/* Cards de Ações Rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <a href="/client/explore" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                        <div className="text-3xl mb-3">🔍</div>
                        <h3 className="font-semibold text-gray-900 mb-2">Explorar Serviços</h3>
                        <p className="text-sm text-gray-600">Descubra profissionais qualificados</p>
                    </a>

                    <a href="/client/reservas" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                        <div className="text-3xl mb-3">📅</div>
                        <h3 className="font-semibold text-gray-900 mb-2">Minhas Reservas</h3>
                        <p className="text-sm text-gray-600">Gerencie suas agendamentos</p>
                    </a>

                    <a href="/client/conta" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                        <div className="text-3xl mb-3">👤</div>
                        <h3 className="font-semibold text-gray-900 mb-2">Minha Conta</h3>
                        <p className="text-sm text-gray-600">Configure seu perfil</p>
                    </a>
                </div>

                {/* Últimas Atividades */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Atividades Recentes</h2>
                    <p className="text-gray-600">Você ainda não tem reservas ou atividades</p>
                </div>
            </div>
        </Container>
    )
}