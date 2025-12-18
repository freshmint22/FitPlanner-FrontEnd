// src/pages/ReportsPage.tsx
import { useEffect, useMemo, useState } from 'react';
import axiosClient from '@/api/axiosClient';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { PageHeader } from '@/components/ui/PageHeader';
import { PageSection } from '@/components/ui/PageSection';
import { KpiCard } from '@/components/ui/KpiCard';

type DashboardKpis = {
  ingresosMes: number;
  totalMiembros: number;
  checkinsHoy: number;
  retencion: number;
};

type IncomeData = {
  mes: string;
  monto: number;
  membresiasCompradas?: number;
};

type MembersData = {
  mes: string;
  total: number;
};

type PaymentMethodDatum = {
  metodo: string;
  total: number;
};

const COLORS = ['#10b981', '#3b82f6', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ef4444'];
const MONTH_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(
    Number.isFinite(value) ? value : 0
  );

const formatPercent = (value: number) => `${Math.round(Number.isFinite(value) ? value : 0)}%`;

const ReportsPage = () => {
  const [kpis, setKpis] = useState<DashboardKpis>({
    ingresosMes: 0,
    totalMiembros: 0,
    checkinsHoy: 0,
    retencion: 0,
  });
  const [incomeData, setIncomeData] = useState<IncomeData[]>([]);
  const [membersData, setMembersData] = useState<MembersData[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodDatum[]>([]);
  const [paymentMethodsTotal, setPaymentMethodsTotal] = useState(0);
  const [retentionValue, setRetentionValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchReports = async () => {
      setError(null);
      try {
        const [kpisRes, incomeRes, membersRes, retentionRes, paymentsRes] = await Promise.all([
          axiosClient.get('/reportes/dashboard-kpis'),
          axiosClient.get('/reportes/ingresos-mensuales'),
          axiosClient.get('/reportes/nuevos-miembros-mes'),
          axiosClient.get('/reportes/retencion'),
          axiosClient.get('/pagos/admin').catch(() => ({ data: { data: [] } })),
        ]);

        if (!isMounted) return;

        const kpisData = kpisRes.data?.data || {};
        setKpis({
          ingresosMes: Number(kpisData.ingresosMes) || 0,
          totalMiembros: Number(kpisData.totalMiembros) || 0,
          checkinsHoy: Number(kpisData.checkinsHoy) || 0,
          retencion: Number(kpisData.retencion) || 0,
        });

        const income = Array.isArray(incomeRes.data?.data) ? incomeRes.data.data : [];
        setIncomeData(
          income.map((item: any) => ({
            mes: MONTH_LABELS[(item.mes || item._id?.month || 1) - 1] || 'Mes',
            monto: Number(item.monto ?? item.ingresosMembresias ?? item.total ?? 0),
            membresiasCompradas: Number(item.membresiasCompradas || 0),
          }))
        );

        const members = Array.isArray(membersRes.data?.data) ? membersRes.data.data : [];
        setMembersData(
          members.map((item: any) => ({
            mes: MONTH_LABELS[(item.mes || item._id?.month || 1) - 1] || 'Mes',
            total: Number(item.total || item.nuevos || item.count || 0),
          }))
        );

        const retencion = retentionRes.data?.retencion ?? retentionRes.data?.data?.retencion ?? 0;
        const activos = retentionRes.data?.activos ?? retentionRes.data?.data?.activos;
        setRetentionValue(Number(retencion) || 0);
        setKpis((prev) => ({
          ...prev,
          totalMiembros: typeof activos === 'number' && prev.totalMiembros === 0 ? activos : prev.totalMiembros,
          retencion: Number(retencion) || prev.retencion,
        }));

        // Métodos de pago
        const rawPayments = paymentsRes?.data?.data ?? paymentsRes?.data?.payments ?? paymentsRes?.data ?? [];
        if (Array.isArray(rawPayments)) {
          const counts = new Map<string, number>();
          rawPayments.forEach((p: any) => {
            const methodRaw = (p.method || p.metodo || '').toString().trim();
            const method = methodRaw ? methodRaw.charAt(0).toUpperCase() + methodRaw.slice(1) : 'Otro';
            counts.set(method, (counts.get(method) || 0) + 1);
          });
          const data = Array.from(counts.entries()).map(([metodo, total]) => ({ metodo, total }));
          const total = data.reduce((sum, d) => sum + d.total, 0);
          setPaymentMethods(data);
          setPaymentMethodsTotal(total);
        }

        // Fallback: if no attendance data returned, compute using reservations per class
      } catch (err) {
        console.error('Error fetching reports:', err);
        if (isMounted) {
          setError('No pudimos cargar los reportes en tiempo real.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchReports();

    const interval = setInterval(fetchReports, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const lastIncomeChange = useMemo(() => {
    if (incomeData.length < 2) return 0;
    const prev = incomeData[incomeData.length - 2]?.monto || 0;
    const current = incomeData[incomeData.length - 1]?.monto || 0;
    if (prev === 0) return current > 0 ? 100 : 0;
    return ((current - prev) / prev) * 100;
  }, [incomeData]);

  const lastNewMembers = membersData[membersData.length - 1]?.total || 0;

  const paymentMethodsChart = useMemo(() => {
    const data = paymentMethods.length ? paymentMethods : [{ metodo: 'Sin datos', total: 1 }];
    const total = paymentMethodsTotal || data.reduce((sum, d) => sum + d.total, 0) || 1;
    return { data, total };
  }, [paymentMethods, paymentMethodsTotal]);

  const exportPaymentMethodsCsv = async () => {
    try {
      let data = paymentMethods;

      // If there is no data yet, fetch fresh from the API
      if (!data.length) {
        const paymentsRes = await axiosClient.get('/pagos/admin').catch(() => ({ data: { data: [] } }));
        const rawPayments = paymentsRes?.data?.data ?? paymentsRes?.data?.payments ?? paymentsRes?.data ?? [];
        if (Array.isArray(rawPayments)) {
          const counts = new Map<string, number>();
          rawPayments.forEach((p: any) => {
            const methodRaw = (p.method || p.metodo || '').toString().trim();
            const method = methodRaw ? methodRaw.charAt(0).toUpperCase() + methodRaw.slice(1) : 'Otro';
            counts.set(method, (counts.get(method) || 0) + 1);
          });
          data = Array.from(counts.entries()).map(([metodo, total]) => ({ metodo, total }));
        }
      }

      if (!data.length) {
        alert('No hay datos de métodos de pago para exportar.');
        return;
      }

      const rows = [
        ['Método de pago', 'Total pagos'],
        ...data.map((d) => [d.metodo, d.total.toString()]),
      ];

      const csv = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `metodos-pago-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error exportando métodos de pago:', err);
      alert('No se pudo exportar los métodos de pago. Intenta más tarde.');
    }
  };

  return (
    <div className="flex flex-col gap-6 page-fade-in">
      <PageHeader
        pill="Reportes"
        title="Reportes y analítica"
        subtitle="Análisis en vivo basado en los datos de MongoDB."
      />

      {error && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-600/30 dark:bg-amber-500/10 dark:text-amber-100">
          {error}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <KpiCard
          label="Ingresos totales"
          value={isLoading ? '...' : formatCurrency(kpis.ingresosMes)}
          helperText={`${lastIncomeChange >= 0 ? '▲' : '▼'} ${Math.abs(lastIncomeChange).toFixed(1)}% vs mes pasado`}
          isLoading={isLoading}
        />
        <KpiCard
          label="Miembros activos"
          value={isLoading ? '...' : kpis.totalMiembros.toLocaleString('es-CO')}
          helperText={`+${lastNewMembers} nuevos este mes`}
          isLoading={isLoading}
        />
      </section>

      <div className="grid gap-4">
        <PageSection title="Ingresos mensuales" description="Ingresos y membresías compradas por mes">
          {isLoading ? (
            <div className="flex h-96 items-center justify-center text-sm text-slate-500">Cargando datos...</div>
          ) : incomeData.length > 0 ? (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={450}>
                <BarChart data={incomeData} margin={{ top: 20, right: 60, left: 110, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="mes"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    label={{ value: 'Ingresos', angle: -90, position: 'left', offset: 20, fill: '#64748b', fontSize: 13, fontWeight: 'bold' }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    label={{ value: 'Membresías', angle: 90, position: 'insideRight', offset: 12, fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                    formatter={(v: number, name) => [name === 'Ingresos' ? formatCurrency(v) : v, name]}
                    labelStyle={{ color: '#1e293b' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="square" />
                  <Bar
                    yAxisId="left"
                    dataKey="monto"
                    name="Ingresos"
                    fill="#0ea5e9"
                    radius={[8, 8, 0, 0]}
                    isAnimationActive
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="membresiasCompradas"
                    name="Membresías"
                    fill="#10b981"
                    radius={[8, 8, 0, 0]}
                    isAnimationActive
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-96 items-center justify-center text-sm text-slate-500">No hay datos disponibles</div>
          )}
        </PageSection>

        <PageSection title="Métodos de pago" description="Distribución por método según pagos registrados">
          {isLoading ? (
            <div className="flex h-80 items-center justify-center text-sm text-slate-500">Cargando datos...</div>
          ) : paymentMethods.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={paymentMethodsChart.data}
                  dataKey="total"
                  nameKey="metodo"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label={({ name, value }) => `${name} ${Math.round((value / paymentMethodsChart.total) * 100)}%`}
                  labelLine={false}
                >
                  {paymentMethodsChart.data.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number, name) => [`${v} pagos`, name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-80 items-center justify-center text-sm text-slate-500">No hay pagos registrados</div>
          )}
        </PageSection>
      </div>

      <PageSection title="Exportar reportes" description="Descarga los reportes en PDF/CSV/Excel">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={async () => {
              try {
                const res = await axiosClient.get('/reportes/dashboard-export-pdf', { responseType: 'blob' });
                const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `ingresos-mensuales-${new Date().toISOString().split('T')[0]}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove();
              } catch (err) {
                console.error('Error exportando PDF de ingresos:', err);
              }
            }}
            className="rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400 px-3 py-1.5 text-xs font-semibold text-white shadow shadow-emerald-500/40"
          >
            Ingresos PDF
          </button>

          <button
            onClick={exportPaymentMethodsCsv}
            className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
          >
            Métodos de pago Excel
          </button>
        </div>
      </PageSection>
    </div>
  );
};

export default ReportsPage;
