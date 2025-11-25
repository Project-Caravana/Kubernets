import React from 'react';
import Layout from '../components/layout/Layout';
import { getEmpresaDashboard, getEmpresaId } from '../api/caravana.js'; 
import { Truck, AlertTriangle, Fuel, Navigation, TrendingUp } from 'lucide-react';
import Chart from 'react-apexcharts';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = React.useState({
        totalCarrosAtivos: 0,
        combustivelGasto: 0,
        kmRodado: 0,
        consumoMedio: 0,
        alertas: 0,
        carrosConsumo: []
    });
    const [loading, setLoading] = React.useState(true);

    // Data atual formatada
    const dataHoje = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    React.useEffect(() => {
        const empresaId = getEmpresaId();
        
        if (!empresaId) {
            setLoading(false);
            return;
        }

        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const response = await getEmpresaDashboard(empresaId);
                const data = response.data.estatisticas;
                
                setDashboardData({
                    totalCarrosAtivos: data.carros?.total || 0,
                    combustivelGasto: data.combustivel?.gastoMes || 0,
                    kmRodado: data.carros?.rodadoMes || 0,
                    consumoMedio: data.combustivel?.consumoMedio || 0,
                    alertas: data.alertas?.total || 0,
                    carrosConsumo: data.carros?.topConsumo || []
                });

            } catch (error) {
                console.error('Erro ao buscar dashboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Configuração do gráfico ApexCharts
    const chartOptions = {
        chart: {
            type: 'bar',
            toolbar: {
                show: false
            },
            fontFamily: 'inherit'
        },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 4,
                dataLabels: {
                    position: 'top'
                }
            }
        },
        colors: ['#FF860B'],
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val.toFixed(1) + ' km/L';
            },
            offsetX: 30,
            style: {
                fontSize: '12px',
                colors: ['#002970']
            }
        },
        xaxis: {
            categories: dashboardData.carrosConsumo.map(c => c.modelo || c.placa || 'Veículo'),
            title: {
                text: 'Consumo (km/L)'
            }
        },
        yaxis: {
            title: {
                text: 'Veículos'
            }
        },
        title: {
            text: 'Carros que mais consomem combustível',
            align: 'left',
            style: {
                fontSize: '16px',
                fontWeight: 600,
                color: '#1f2937'
            }
        },
        grid: {
            borderColor: '#e5e7eb'
        }
    };

    const chartSeries = [{
        name: 'Consumo',
        data: dashboardData.carrosConsumo.map(c => c.consumo || 0)
    }];

    // Card de métrica reutilizável
    // eslint-disable-next-line no-unused-vars
    const MetricCard = ({ title, value, icon: IconComponent, color, suffix = '' }) => (
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    {loading ? (
                        <div className="w-16 h-8 bg-gray-200 animate-pulse rounded"></div>
                    ) : (
                        <p className={`text-3xl font-bold ${color}`}>
                            {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
                            {suffix && <span className="text-lg ml-1">{suffix}</span>}
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-full bg-opacity-10 ${color}`}>
                    <IconComponent size={28} className={color} />
                </div>
            </div>
        </div>
    );

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header com data */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-sm text-gray-600 capitalize">{dataHoje}</p>
                </div>

                {/* Cards Superiores - Alertas, Carros Ativos, Km Rodado */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Alertas */}
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-lg shadow-md border-l-4 border-red-500 hover:shadow-lg transition-shadow">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-red-500 rounded-full">
                                <AlertTriangle size={24} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Alertas</h3>
                                {loading ? (
                                    <div className="w-12 h-12 bg-red-200 animate-pulse rounded"></div>
                                ) : (
                                    <p className="text-5xl font-bold text-red-600">
                                        {dashboardData.alertas}
                                    </p>
                                )}
                                <p className="text-sm text-gray-600 mt-2">
                                    {dashboardData.alertas > 0 ? 'Requerem atenção' : 'Tudo ok!'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Carros Ativos */}
                    <MetricCard 
                        title="Carros Ativos"
                        value={dashboardData.totalCarrosAtivos}
                        icon={Truck}
                        color="text-blue-600"
                    />
                    
                    {/* Km Rodado */}
                    <MetricCard 
                        title="Km Rodado pela Frota no Mês"
                        value={dashboardData.kmRodado}
                        icon={Navigation}
                        color="text-green-600"
                        suffix="km"
                    />
                </div>

                {/* Grid Inferior - Gráfico + Cards de Combustível */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Gráfico de Carros que mais consomem - 2 colunas */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                        {loading ? (
                            <div className="h-96 flex items-center justify-center">
                                <div className="w-12 h-12 border-4 border-gray-200 border-t-[#FF860B] rounded-full animate-spin"></div>
                            </div>
                        ) : dashboardData.carrosConsumo.length > 0 ? (
                            <Chart
                                options={chartOptions}
                                series={chartSeries}
                                type="bar"
                                height={400}
                            />
                        ) : (
                            <div className="h-96 flex items-center justify-center text-gray-500">
                                <div className="text-center">
                                    <Truck size={48} className="mx-auto mb-4 text-gray-300" />
                                    <p>Nenhum dado de consumo disponível</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Coluna Direita - Cards de Combustível - 1 coluna */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <MetricCard 
                            title="Combustível Gasto (mês)"
                            value={dashboardData.combustivelGasto}
                            icon={Fuel}
                            color="text-orange-600"
                            suffix="L"
                        />
                        
                        <MetricCard 
                            title="Consumo Médio de Combustível"
                            value={dashboardData.consumoMedio.toFixed(1)}
                            icon={TrendingUp}
                            color="text-purple-600"
                            suffix="km/L"
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;