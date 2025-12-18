// src/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { PageSection } from '@/components/ui/PageSection';
import { KpiCard } from '@/components/ui/KpiCard';
import axiosClient from '@/api/axiosClient';

interface DashboardKPIs {
  totalMiembros: number;
  ingresosMes: number;
  retencion: number;
}

interface MembresiaData {
  _id: string;
  nombre: string;
  precio: number;
  estado: 'activo' | 'inactivo';
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isLoadingKpis, setIsLoadingKpis] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [kpis, setKpis] = useState<DashboardKPIs>({
    totalMiembros: 0,
    ingresosMes: 0,
    retencion: 0,
  });
  const [membresias, setMembresias] = useState<MembresiaData[]>([]);
  const [membrosCount, setMembrosCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpisRes, membresiaRes, membrosRes] = await Promise.all([
          axiosClient.get('/reportes/dashboard-kpis').catch(() => ({ data: {} })),
          axiosClient.get('/plans').catch(() => ({ data: { data: [] } })),
          axiosClient.get('/members').catch(() => ({ data: { data: [] } })),
        ]);

        const kpisData = kpisRes.data?.data || kpisRes.data || {};
        setKpis({
          totalMiembros: Number(kpisData.totalMiembros) || 0,
          ingresosMes: Number(kpisData.ingresosMes) || 0,
          retencion: Number(kpisData.retencion) || 0,
        });

        const plans = Array.isArray(membresiaRes.data?.data) ? membresiaRes.data.data : [];
        setMembresias(plans.slice(0, 3));

        const miembros = Array.isArray(membrosRes.data?.data) ? membrosRes.data.data : [];
        setMembrosCount(miembros.length);
      } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
      } finally {
        setIsLoadingData(false);
        setIsLoadingKpis(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(
      Number.isFinite(value) ? value : 0
    );

  return (
    <div className="flex flex-col gap-6 page-fade-in">
      <PageHeader
        pill="Panel administrativo"
        title="Hola, Administrador"
        subtitle="Supervisa el rendimiento del gimnasio en tiempo real."
      />

      {/* KPIs principales */}
      <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          label="Total de miembros"
          value={isLoadingKpis ? '...' : kpis.totalMiembros.toLocaleString('es-CO')}
          helperText={`${membrosCount} registrados en el sistema`}
          isLoading={isLoadingKpis}
        />
        <KpiCard
          label="Ingresos este mes"
          value={isLoadingKpis ? '...' : formatCurrency(kpis.ingresosMes)}
          helperText="Ingresos totales del mes actual"
          isLoading={isLoadingKpis}
        />
        <KpiCard
          label="Retención"
          value={isLoadingKpis ? '...' : `${Math.round(kpis.retencion)}%`}
          helperText="Tasa de retención de miembros"
          isLoading={isLoadingKpis}
        />
      </section>

      {/* Grid de resúmenes */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Resumen de Membresías */}
        <PageSection
          title="Membresías"
          description="Planes disponibles activos en el sistema"
          rightSlot={
            <button
              onClick={() => navigate('/memberships')}
              className="text-xs font-semibold text-sky-500 hover:text-sky-400"
            >
              Ver más
            </button>
          }
        >
          {isLoadingData ? (
            <div className="text-sm text-slate-500">Cargando...</div>
          ) : membresias.length > 0 ? (
            <div className="space-y-2">
              {membresias.map((plan) => (
                <div
                  key={plan._id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/80"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {plan.nombre}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      ${plan.precio.toLocaleString('es-CO')}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      plan.estado === 'activo'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300'
                    }`}
                  >
                    {plan.estado === 'activo' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-slate-500">No hay membresías disponibles</div>
          )}
        </PageSection>

        {/* Resumen de Miembros */}
        <PageSection
          title="Miembros"
          description="Gestión y seguimiento de miembros"
          rightSlot={
            <button
              onClick={() => navigate('/members')}
              className="text-xs font-semibold text-sky-500 hover:text-sky-400"
            >
              Ver más
            </button>
          }
        >
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/80">
              <p className="text-xs text-slate-600 dark:text-slate-400">Total registrado</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {membrosCount.toLocaleString('es-CO')}
              </p>
            </div>
            <button
              onClick={() => navigate('/members')}
              className="w-full rounded-xl bg-sky-500 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-400"
            >
              Gestionar miembros
            </button>
          </div>
        </PageSection>
      </div>

      {/* Grid inferior: Reportes y Perfil */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Reportes */}
        <PageSection
          title="Reportes"
          description="Análisis en vivo del gimnasio"
          rightSlot={
            <button
              onClick={() => navigate('/reports')}
              className="text-xs font-semibold text-sky-500 hover:text-sky-400"
            >
              Ver reportes completos
            </button>
          }
        >
          <div className="space-y-2">
            <button
              onClick={() => navigate('/reports')}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-900 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Ingresos mensuales
            </button>
            <button
              onClick={() => navigate('/reports')}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-900 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Métodos de pago
            </button>
            <button
              onClick={() => navigate('/reports')}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-900 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Nuevos miembros
            </button>
          </div>
        </PageSection>

        {/* Perfil y Configuración */}
        <PageSection
          title="Mi Perfil"
          description="Gestión de tu cuenta y configuración"
          rightSlot={
            <button
              onClick={() => navigate('/settings')}
              className="text-xs font-semibold text-sky-500 hover:text-sky-400"
            >
              Editar
            </button>
          }
        >
          <div className="space-y-2">
            <button
              onClick={() => navigate('/settings')}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-900 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Información personal
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-900 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Cambiar contraseña
            </button>
          </div>
        </PageSection>
      </div>
    </div>
  );
}
