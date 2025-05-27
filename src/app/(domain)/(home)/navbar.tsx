"use client";
import Link from "next/link";
import Image from "next/image";
import { SearchInput } from "./desktop/search-input";
import { OrgSwitcher } from "@/components/org-switcher";
import { CustomUserButton } from "@/components/custom-user-button";

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between h-full w-full">
      <div className="flex gap-3 items-center shrink-0 pr-6">
        <Link href="/desktop">
          <Image src="/logo.jpg" alt="Logo" height={36} width={36} />
        </Link>
        <h3 className="text-xl font-bold">银河云文档</h3>
      </div>
      <SearchInput />
      <div className="flex items-center gap-4 pl-6">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          访问官网
        </a>
        <OrgSwitcher />
        <CustomUserButton />
      </div>
    </nav>
  );
};
