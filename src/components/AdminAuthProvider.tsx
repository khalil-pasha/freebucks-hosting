"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/lib/api';

interface AdminUser {
  id: string;
  username: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  loading: boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  admin: null,
  loading: true,
  logout: () => {}
});

export const useAdminAuth = () => useContext(AdminAuthContext);

export default function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const pathname = usePathname();

  const fetchAdmin = async () => {
    try {
      const res = await api.get(`/admin/auth/me?t=${Date.now()}`);
      setAdmin(res.data);
    } catch (error: any) {
      console.error('Failed to fetch admin:', error);
      setAdmin(null);
      if (pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmin();
  }, [pathname, router]);

  const logout = async () => {
    try {
      await api.post('/admin/auth/logout');
    } catch (err) {
      console.error('Logout error', err);
    }
    setAdmin(null);
    router.push('/admin/login');
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
