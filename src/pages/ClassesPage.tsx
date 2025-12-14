// src/pages/ClassesPage.tsx
import { useEffect, useState } from 'react';
import { axiosClient } from '@/api/axiosClient';
import { EditClassModal } from '@/components/modals/EditClassModal';
import { useAuth } from '@/context/AuthContext';

interface Class {
  _id: string;
  name: string;
  level?: string;
  room?: string;
  hour?: string;
  trainer?: string;
  capacity?: number;
  reservations?: number;
}

const ClassesPage = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data } = await axiosClient.get('/classes');
        setClasses(data || []);
      } catch (error) {
        console.error('Error cargando clases:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasses();
  }, []);

  return (
    <div className="min-h-full bg-white pb-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-6xl px-4 pt-6 space-y-6">
        {/* Resumen rápido - Datos dinámicos */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/30">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Clases de hoy
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-50">{classes.length}</p>
            <p className="mt-1 text-xs text-slate-500">
              Entre fuerza, cardio y funcional.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/30">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Ocupación promedio
            </p>
            <p className="mt-2 text-2xl font-semibold text-emerald-400">
              {classes.length > 0 
                ? Math.round((classes.reduce((sum, c) => sum + (c.reservations || 0), 0) / 
                    classes.reduce((sum, c) => sum + (c.capacity || 1), 0)) * 100) + '%'
                : '0%'}
            </p>
            <div className="mt-2 h-2 rounded-full bg-slate-800">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400" 
                style={{
                  width: classes.length > 0 
                    ? `${Math.round((classes.reduce((sum, c) => sum + (c.reservations || 0), 0) / 
                        classes.reduce((sum, c) => sum + (c.capacity || 1), 0)) * 100)}%`
                    : '0%'
                }}
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Basado en reservas vs cupos disponibles.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/30">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Próxima clase
            </p>
            <p className="mt-2 text-base font-semibold text-slate-50">
              {classes[0]?.name || 'Sin clases programadas'}
            </p>
            <p className="text-xs text-slate-400">
              {classes[0]?.hour || 'N/A'} · {classes[0]?.room || 'N/A'}
            </p>
          </div>
        </section>

        {/* Listado de clases */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/30">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-50">
                Clases del día
              </h2>
              <p className="text-xs text-slate-400">
                Revisa y gestiona las clases programadas.
              </p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900">
                Ver calendario
              </button>
              <button className="rounded-lg bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 px-3 py-1.5 text-xs font-semibold text-white shadow shadow-emerald-500/40">
                Nueva clase
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <p className="text-center text-sm text-slate-400">Cargando clases...</p>
            ) : classes.length === 0 ? (
              <p className="text-center text-sm text-slate-400">No hay clases disponibles</p>
            ) : (
              classes.map((cls) => (
                <div
                  key={cls._id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-50">
                      {cls.name}
                    </p>
                  <p className="text-xs text-slate-400">
                    {cls.hour || 'Horario no especificado'} · {cls.room || 'Sala no especificada'}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Entrenador:{" "}
                    <span className="font-medium text-slate-200">
                      {cls.trainer || 'No asignado'}
                    </span>{" "}
                    · Nivel: {cls.level || 'Sin nivel'}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <div className="text-right">
                    <p className="text-[11px] text-slate-500">Cupos</p>
                    <p className="font-semibold">{cls.reservations || 0} / {cls.capacity || 0}</p>
                  </div>
                  {user?.role === 'ADMIN' && (
                    <button 
                      onClick={() => {
                        setSelectedClass(cls);
                        setIsEditModalOpen(true);
                      }}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                    >
                      Editar
                    </button>
                  )}
                  {user?.role !== 'ADMIN' && (
                    <button className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
                      Reservar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Modal de edición (solo admin) */}
      {user?.role === 'ADMIN' && (
        <EditClassModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedClass(null);
          }}
          classData={selectedClass}
          onSuccess={() => {
            const fetchClasses = async () => {
              try {
                const { data } = await axiosClient.get('/classes');
                setClasses(data || []);
              } catch (error) {
                console.error('Error recargando clases:', error);
              }
            };
            fetchClasses();
          }}
        />
      )}
    </div>
  );
};

export default ClassesPage;
