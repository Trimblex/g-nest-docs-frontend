"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "@/config/axiosConfig";
import { UserInfoVO } from "@/interface/users";
import { useRouter } from "next/navigation";

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  token?: string;
  login: (account: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  user?: UserInfoVO;
  setUser: (user: AuthContextType["user"]) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string>();
  const [user, setUser] = useState<AuthContextType["user"]>();
  const router = useRouter();
  // Token验证方法
  const validateToken = async (token: string) => {
    try {
      await axios.get("/auth/validate", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return true;
    } catch (error: Error | any) {
      console.error("Token验证失败", error);
      return false;
    }
  };
  const initializeAuth = async () => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      if (await validateToken(storedToken)) {
        // 获取用户信息
        const userResponse = await axios.get("/users/info", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setUser(userResponse.data);
        setToken(storedToken);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
      }
    }
    setIsLoading(false);
  };
  // 初始化认证状态
  useEffect(() => {
    initializeAuth();
  }, [token]);

  // 登录方法
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "/auth/login",
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const { token } = response.data;
      localStorage.setItem("authToken", token);
      await initializeAuth();
    } finally {
      setIsLoading(false);
    }
  };

  // 登出方法
  const logout = async () => {
    try {
      await axios.post("/auth/logout");
    } finally {
      localStorage.removeItem("authToken");
      setToken(undefined);
      setIsAuthenticated(false);
      setUser(undefined);
      router.replace("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        token,
        login,
        logout,
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
