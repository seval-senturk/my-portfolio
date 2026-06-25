"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface AdminShellContextValue {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const AdminShellContext = createContext<AdminShellContextValue | null>(null);

interface AdminShellProviderProps {
  children: ReactNode;
}

export function AdminShellProvider({ children }: AdminShellProviderProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((current) => !current);
  }, []);

  const value = useMemo(
    () => ({
      isSidebarCollapsed,
      toggleSidebar,
      setSidebarCollapsed: setIsSidebarCollapsed,
    }),
    [isSidebarCollapsed, toggleSidebar],
  );

  return (
    <AdminShellContext.Provider value={value}>{children}</AdminShellContext.Provider>
  );
}

export function useAdminShell() {
  const context = useContext(AdminShellContext);

  if (!context) {
    throw new Error("useAdminShell must be used within AdminShellProvider");
  }

  return context;
}
