"use client";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div>
      {/* 统一顶部导航栏 */}
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.jpg"
              onClick={() => router.push("/")}
              alt="Logo"
              width={36}
              height={36}
              className="h-8 w-8 rounded-lg cursor-pointer"
            />

            <span className="flex items-center text-lg font-bold text-blue-600">
              文件预览中心
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/myCloudDisk")}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              返回文件列表
            </button>
          </div>
        </div>
      </nav>

      {/* 添加顶部导航栏高度的占位空间 */}
      <div className="h-16"></div>

      <div className="max-w-7xl mx-auto px-4">{children}</div>
    </div>
  );
}
