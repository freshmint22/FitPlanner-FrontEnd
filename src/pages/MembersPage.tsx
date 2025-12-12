// src/pages/MembersPage.tsx
import { useEffect, useState } from 'react';
import membersService from '@/api/membersService';
import type { MemberDto } from '@/api/membersService';

const MembersPage = () => {
  const [members, setMembers] = useState<MemberDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

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
    <div className="min-h-full bg-slate-950 pb-10">
      <div className="mx-auto max-w-6xl px-4 pt-6 space-y-6">
        <section className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg shadow-black/30">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-50">Miembros del gimnasio</h2>
              <p className="text-xs text-slate-400">Administra la base de datos de miembros y sus planes.</p>
            </div>
            <div className="flex gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') fetchMembers(query); }}
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
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
            <table className="min-w-full text-xs text-left text-slate-300">
              <thead className="border-b border-slate-800 text-[11px] text-slate-500 uppercase">
                <tr>
                  <th className="py-2 pr-4">Nombre</th>
                  <th className="py-2 pr-4">Correo</th>
                  <th className="py-2 pr-4">Rol</th>
                  <th className="py-2 pr-4">Estado</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="py-4 text-center text-slate-400">Cargando...</td></tr>
                ) : members.length === 0 ? (
                  <tr><td colSpan={4} className="py-4 text-center text-slate-400">No hay miembros</td></tr>
                ) : (
                  members.map((m) => (
                    <tr key={m.id} className="border-b border-slate-900">
                      <td className="py-2 pr-4 text-slate-100">{m.firstName} {m.lastName}</td>
                      <td className="py-2 pr-4">{m.email}</td>
                      <td className="py-2 pr-4">{m.rol ?? '-'}</td>
                      <td className="py-2 pr-4">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${m.estado === 'active' ? 'bg-emerald-500/10 text-emerald-400' : m.estado === 'por_vencer' ? 'bg-amber-500/10 text-amber-300' : 'bg-red-500/10 text-red-400'}`}>
                          {m.estado ?? '—'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MembersPage;
