// src/pages/MembersPage.tsx
import { useEffect, useState } from 'react';
import membersService from '@/api/membersService';
import type { MemberDto } from '@/api/membersService';
import { EditMemberModal } from '@/components/modals/EditMemberModal';

const MembersPage = () => {
  const [members, setMembers] = useState<MemberDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<MemberDto | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchMembers = async (q = '') => {
    setLoading(true);
    try {
      const res = await membersService.listMembers(1, 50, q);
      setMembers(res.items);
    } catch (err) {
      // podríamos mostrar una notificación aquí
      console.error('Error fetching members', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className="min-h-full bg-white pb-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-6xl px-4 pt-6 space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/30">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Miembros del gimnasio</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">Administra la base de datos de miembros y sus planes.</p>
            </div>
            <div className="flex gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') fetchMembers(query); }}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                placeholder="Buscar por nombre o correo..."
              />
              <button
                onClick={() => fetchMembers(query)}
                className="rounded-lg bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 px-3 py-1.5 text-xs font-semibold text-white shadow shadow-emerald-500/40"
              >
                Buscar
              </button>
              <button className="rounded-lg bg-gradient-to-r from-green-600 to-emerald-400 px-3 py-1.5 text-xs font-semibold text-white shadow shadow-emerald-500/40">
                Nuevo miembro
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-left text-slate-800 dark:text-slate-300">
              <thead className="border-b border-slate-300 text-[11px] text-slate-600 uppercase dark:border-slate-800 dark:text-slate-500">
                <tr>
                  <th className="py-2 pr-4">Nombre</th>
                  <th className="py-2 pr-4">Correo</th>
                  <th className="py-2 pr-4">Rol</th>
                  <th className="py-2 pr-4">Estado</th>
                  <th className="py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="py-4 text-center text-slate-400">Cargando...</td></tr>
                ) : members.length === 0 ? (
                  <tr><td colSpan={5} className="py-4 text-center text-slate-400">No hay miembros</td></tr>
                ) : (
                  members.map((m) => (
                    <tr key={m.id} className="border-b border-slate-200 dark:border-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="py-2 pr-4 text-slate-900 dark:text-slate-100">{m.firstName} {m.lastName}</td>
                      <td className="py-2 pr-4">{m.email}</td>
                      <td className="py-2 pr-4">{m.rol ?? '-'}</td>
                      <td className="py-2 pr-4">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${m.estado === 'activo' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}>
                          {m.estado ?? '—'}
                        </span>
                      </td>
                      <td className="py-2">
                        <button
                          onClick={() => {
                            setSelectedMember(m);
                            setIsEditModalOpen(true);
                          }}
                          className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

      {/* Modal de edición */}
      <EditMemberModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
        onSuccess={() => {
          fetchMembers(query);
        }}
      />
      </div>
    </div>
  );
};

export default MembersPage;
