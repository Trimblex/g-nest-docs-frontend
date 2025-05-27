"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useAuth } from "./auth-context";
import axios from "@/config/axiosConfig";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { OrgInfoVO } from "@/interface/orgs";

type OrgContextType = {
  currentOrg: OrgInfoVO | null;
  organizations: OrgInfoVO[];
  isLoading: boolean;
  error: Error | null;
  switchOrg: (orgId: string | null) => Promise<void>;
  refreshOrgs: () => Promise<void>;
};

const OrgContext = createContext<OrgContextType | undefined>(undefined);

export function OrgProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [currentOrg, setCurrentOrg] = useState<OrgInfoVO | null>(null);
  const [organizations, setOrganizations] = useState<OrgInfoVO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fetchOrganizations = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.get<OrgInfoVO[]>("/org/getAll");

      const orgs = res.data;

      setOrganizations(orgs);

      // 检查URL中的组织参数
      const orgId = searchParams.get("org");
      if (orgId) {
        const validOrg = orgs.find((org) => org.id === orgId);
        if (validOrg) {
          switchOrg(validOrg.id);
        } else {
          // 无效组织ID则清除参数
          const params = new URLSearchParams(searchParams.toString());
          params.delete("org");
          router.replace(`${pathname}?${params.toString()}`);
        }
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [pathname, searchParams, router]);

  // 切换组织
  const switchOrg = useCallback(
    async (orgId: string | null) => {
      try {
        await axios.post("/org/switch", { orgId });

        const r = await axios.get<OrgInfoVO>("/org/getCurrent");
        const currentOrg = r.data;

        setCurrentOrg(currentOrg);
        // 自动同步URL参数
        const params = new URLSearchParams(window.location.search);
        if (orgId) {
          params.set("org", orgId);
        } else {
          params.delete("org");
        }
        // 同时更新URL和上下文状态
        router.replace(`${pathname}?${params.toString()}`);
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    },
    [organizations, pathname, searchParams, router]
  );

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrganizations();
    } else {
      setOrganizations([]);
      setCurrentOrg(null);
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  return (
    <OrgContext.Provider
      value={{
        currentOrg,
        organizations,
        isLoading,
        error,
        switchOrg,
        refreshOrgs: fetchOrganizations,
      }}
    >
      {children}
    </OrgContext.Provider>
  );
}

export const useOrg = () => {
  const context = useContext(OrgContext);
  if (!context) {
    throw new Error("useOrg must be used within an OrgProvider");
  }
  return context;
};
