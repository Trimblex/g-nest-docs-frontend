"use client";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { useState } from "react";
import clsx from "clsx";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen">
      {/* 顶部导航栏 */}
      <div className="fixed top-0 left-0 right-0 z-10 h-16 bg-white p-4">
        <Navbar />
      </div>

      {/* 侧边栏（传递状态） */}
      <Sidebar isCollapsed={isCollapsed} onCollapse={setIsCollapsed} />

      {/* 主内容区域（动态调整间距） */}
      <main
        className={clsx(
          "mt-16 min-h-[calc(100vh-4rem)] transition-[margin-left] duration-100 ease-in-out",
          {
            "ml-64": !isCollapsed,
            "ml-20": isCollapsed,
          }
        )}
      >
        {children}
      </main>
    </div>
  );
}
