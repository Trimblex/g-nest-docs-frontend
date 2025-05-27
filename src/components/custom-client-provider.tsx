"use client";

import { ReactNode } from "react";
import { FullScreenLoader } from "./fullscreen-loader";
import { AuthProvider, useAuth } from "../providers/auth-context";
import { Login } from "./login";
import { usePathname } from "next/navigation";
import { OrgProvider } from "@/providers/org-context";

export function CustomClientProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <OrgProvider>
        <AuthGate>{children}</AuthGate>
      </OrgProvider>
    </AuthProvider>
  );
}

function AuthGate({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const publicRoutes = ["/register", "/login", "/forgot-password", "/terms"];

  if (publicRoutes.includes(pathname)) {
    return <>{children}</>;
  }
  if (isLoading) return <FullScreenLoader label="加载中..." />;
  if (!isAuthenticated) return <Login redirectTo={pathname} />;

  return <>{children}</>;
}
