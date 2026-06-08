"use client";

import { useAdminAuth } from "@/components/AdminAuthProvider";

export function AdminName() {
  const { admin } = useAdminAuth();
  return (
    <>
      <span className="text-sm font-bold leading-none">{admin?.username || 'Loading...'}</span>
      <span className="text-[10px] text-foreground/50 uppercase tracking-widest mt-1">System</span>
    </>
  );
}
