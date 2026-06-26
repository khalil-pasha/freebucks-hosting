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
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        if (pathname.startsWith('/dashboard')) {
          router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
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
    const tokenFromUrl = params.get('token');
    console.log('[Auth] Search params token:', tokenFromUrl ? 'exists' : 'missing');
    
    if (tokenFromUrl) {
      localStorage.setItem('freebucks_token', tokenFromUrl);
      localStorage.removeItem('freebucks_manual_logout');
      console.log('[Auth] Token saved to localStorage.');
      // Clean URL but preserve other query parameters
      const url = new URL(window.location.href);
      url.searchParams.delete('token');
      window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
      
      const postLoginRedirect = localStorage.getItem('post_login_redirect');
      if (postLoginRedirect) {
        localStorage.removeItem('post_login_redirect');
        if (pathname === '/dashboard') {
          router.push(postLoginRedirect);
        }
      }
    }

    const currentToken = localStorage.getItem('freebucks_token');
    
    if (currentToken) {
      console.log('[Auth] Fetching user...');
      fetchUser();
    } else {
      console.log('[Auth] No token found, setting loading to false.');
      setLoading(false);
        if (pathname.startsWith('/dashboard')) {
          router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        }
    }
  }, [pathname, router]);

  const logout = () => {
    console.log("[Auth] Logout clicked");
    localStorage.removeItem('freebucks_token');
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    localStorage.setItem('freebucks_manual_logout', 'true');
    console.log("[Auth] Tokens cleared and manual logout marker set");
    setUser(null);
    setLoading(false);
    console.log("[Auth] User cleared");
    router.replace('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refetchUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}
