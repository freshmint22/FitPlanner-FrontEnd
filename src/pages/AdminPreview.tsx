import { useEffect } from 'react';

// Dev helper: sets a demo ADMIN user in localStorage and redirects to /admin
export default function AdminPreview() {
  useEffect(() => {
    try {
      const demoUser = {
        id: 'demo-admin-1',
        name: 'robert Díaz',
        email: 'robert@gym.com',
        role: 'ADMIN',
      };
      localStorage.setItem('accessToken', 'demo-admin-token');
      localStorage.setItem('user', JSON.stringify(demoUser));
    } catch (e) {
      // ignore
    }
    window.location.href = '/admin';
  }, []);

  return <div className="p-6">Preparando vista de administrador…</div>;
}
