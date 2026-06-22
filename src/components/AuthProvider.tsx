"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/lib/api';

interface User {
  id: string;
  discordId: string;
  username: string;
  avatar: string;
  email: string;
  role: string;
  balance: number;
  pterodactylUserId?: number;
  createdAt: string;
  isPremium?: boolean;
  premiumExpiresAt?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: () => {},
  refetchUser: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = async () => {
    try {
      const res = await api.get(`/auth/me?t=${Date.now()}`);
      setUser(res.data);
    } catch (error: any) {
      console.error('Failed to fetch user:', error);
      setUser(null);
      if (error.response?.status === 401) {
        localStorage.removeItem('freebucks_token');
        if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
          router.push('/');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    console.log('[Auth] Effect triggered. Pathname:', pathname);
    const params = new URLSearchParams(window.location.search);
    console.log('[Auth] Search params:', params.toString());
    const tokenFromUrl = params.get('token');
    
    if (tokenFromUrl) {
      localStorage.setItem('freebucks_token', tokenFromUrl);
      // Clean URL but preserve other query parameters
      const url = new URL(window.location.href);
      url.searchParams.delete('token');
      window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
      
      const postLoginRedirect = localStorage.getItem('post_login_redirect');
      if (postLoginRedirect) {
        localStorage.removeItem('post_login_redirect');
        console.log('[Auth] Found post_login_redirect:', postLoginRedirect);
        if (pathname === '/dashboard') {
          console.log('[Auth] Redirecting to postLoginRedirect:', postLoginRedirect, 'Reason: pathname is /dashboard');
          router.push(postLoginRedirect);
        } else {
          console.log('[Auth] Skipping postLoginRedirect push because pathname is:', pathname);
        }
      }
    }

    const currentToken = localStorage.getItem('freebucks_token');
    
    if (currentToken) {
      fetchUser();
    } else {
      setLoading(false);
      // If no token and not on public pages, you could redirect to /
      if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
        console.log('[Auth] Redirecting to / because no token and trying to access:', pathname);
        router.push('/');
      }
    }
  }, [pathname, router]);

  const logout = () => {
    localStorage.removeItem('freebucks_token');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refetchUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}
