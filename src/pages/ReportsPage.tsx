// src/pages/ReportsPage.tsx
import { useEffect, useState } from 'react';
import axiosClient from '@/api/axiosClient';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Reports {
  ingresos: string;
  nuevosMiembros: number;
  retencion: string;
}

interface IncomeData {
  mes: string;
  ingresos: number;
}

interface MembersData {
  mes: string;
  nuevos: number;
}

interface RetentionData {
  mes: string;
  retencion: number;
}

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

const ReportsPage = () => {
  const [reports, setReports] = useState<Reports>({
    ingresos: '$0',
    nuevosMiembros: 0,
    retencion: '0%'
  });
  const [incomeData, setIncomeData] = useState<IncomeData[]>([]);
  const [membersData, setMembersData] = useState<MembersData[]>([]);
  const [retentionData, setRetentionData] = useState<RetentionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Fetch KPIs
        const kpisRes = await axiosClient.get('/reports/dashboard-kpis');
        setReports({
          ingresos: kpisRes.data.ingresosMes || '$0',
          nuevosMiembros: kpisRes.data.nuevosMiembros || 0,
          retencion: kpisRes.data.retencion || '0%'
        });

        // Fetch income chart data
        const incomeRes = await axiosClient.get('/reports/ingresos-mensuales');
        if (incomeRes.data && Array.isArray(incomeRes.data)) {
          setIncomeData(incomeRes.data.map((item: any) => ({
            mes: item.mes || item._id || 'N/A',
            ingresos: item.total || item.ingresos || 0
          })));
        }

        // Fetch new members chart data
        const membersRes = await axiosClient.get('/reports/nuevos-miembros-mes');
        if (membersRes.data && Array.isArray(membersRes.data)) {
          setMembersData(membersRes.data.map((item: any) => ({
            mes: item.mes || item._id || 'N/A',
            nuevos: item.count || item.nuevos || 0
          })));
        }

        // Fetch retention chart data
        const retentionRes = await axiosClient.get('/reports/retencion');
        if (retentionRes.data && Array.isArray(retentionRes.data)) {
          setRetentionData(retentionRes.data.map((item: any) => ({
            mes: item.mes || item._id || 'N/A',
            retencion: item.porcentaje || item.retencion || 0
          })));
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
    
    // Auto-refresh every 30 seconds to get latest data from MongoDB
    const interval = setInterval(fetchReports, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-full bg-white pb-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-6xl px-4 pt-6 space-y-6">
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-lg shadow-slate-200/40 dark:bg-slate-900/90 dark:border-slate-800 dark:shadow-black/30">
            <p className="text-[11px] uppercase tracking-wide text-slate-600 dark:text-slate-400">
              Ingresos este mes
            </p>
            <p className="mt-2 text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
              {isLoading ? '...' : reports.ingresos}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Crecimiento del 12% vs mes anterior.
            </p>
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-lg shadow-slate-200/40 dark:bg-slate-900/90 dark:border-slate-800 dark:shadow-black/30">
            <p className="text-[11px] uppercase tracking-wide text-slate-600 dark:text-slate-400">
              Nuevos miembros
            </p>
            <p className="mt-2 text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {isLoading ? '...' : reports.nuevosMiembros}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Registrados en los últimos 30 días.
            </p>
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-lg shadow-slate-200/40 dark:bg-slate-900/90 dark:border-slate-800 dark:shadow-black/30">
            <p className="text-[11px] uppercase tracking-wide text-slate-600 dark:text-slate-400">
              Retención
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-50">
              {isLoading ? '...' : reports.retencion}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Miembros que mantienen su plan.
            </p>
          </div>
        </section>

        {/* Gráfica de Ingresos Mensuales */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/30">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-4">
            Ingresos Mensuales
          </h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-slate-500">Cargando datos...</p>
            </div>
          ) : incomeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={incomeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ingresos" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-slate-500">No hay datos disponibles</p>
            </div>
          )}
        </section>

        {/* Gráfica de Nuevos Miembros */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/30">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-4">
            Nuevos Miembros por Mes
          </h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-slate-500">Cargando datos...</p>
            </div>
          ) : membersData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={membersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="nuevos" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-slate-500">No hay datos disponibles</p>
            </div>
          )}
        </section>

        {/* Gráfica de Retención */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/30">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-4">
            Retención de Miembros (%)
          </h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-slate-500">Cargando datos...</p>
            </div>
          ) : retentionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={retentionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="retencion" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-slate-500">No hay datos disponibles</p>
            </div>
          )}
        </section>

        {/* Sección de exportación */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/30">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                Exportar Reportes
              </h2>
              <p className="text-xs text-slate-400">
                Descarga información completa del dashboard.
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={async () => {
                  try {
                    const res = await axiosClient.get('/reports/dashboard-export-csv', { responseType: 'blob' });
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `dashboard-${new Date().toISOString().split('T')[0]}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                  } catch (error) {
                    console.error('Error exporting CSV:', error);
                  }
                }}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900">
                Exportar CSV
              </button>
              <button 
                onClick={async () => {
                  try {
                    const res = await axiosClient.get('/reports/dashboard-export-pdf', { responseType: 'blob' });
                    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `dashboard-${new Date().toISOString().split('T')[0]}.pdf`);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                  } catch (error) {
                    console.error('Error exporting PDF:', error);
                  }
                }}
                className="rounded-lg bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 px-3 py-1.5 text-xs font-semibold text-white shadow shadow-emerald-500/40">
                Descargar PDF
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ReportsPage;
