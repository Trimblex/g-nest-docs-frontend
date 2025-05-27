import Image from "next/image";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={36}
              height={36}
              className="h-8 w-8 rounded-lg"
            />
            <span className="text-xl font-bold text-blue-600">银河云文档</span>
          </div>
          <a
            href="/desktop"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            立即体验
          </a>
        </div>
      </nav>
      <div>{children}</div>
    </div>
  );
}
