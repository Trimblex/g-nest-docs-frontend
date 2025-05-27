"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, Home, Cloud } from "lucide-react";

type SidebarProps = {
  isCollapsed: boolean;
  onCollapse: (state: boolean) => void;
};

export const Sidebar = ({ isCollapsed, onCollapse }: SidebarProps) => {
  const pathname = usePathname();

  const toggleSidebar = () => {
    onCollapse(!isCollapsed);
  };
  return (
    <div
      className={clsx(
        "h-[calc(100vh-4rem)] fixed left-0 top-16 bg-gray-50 border-r border-gray-100 transition-all duration-300 ease-in-out",
        {
          "w-56": !isCollapsed,
          "w-16": isCollapsed,
        }
      )}
    >
      <div className="relative z-10">
        {/* 折叠按钮 */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1.5 shadow-sm hover:bg-gray-50 transition-all z-10"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          )}
        </button>

        <nav className="p-2.5">
          <ul className="space-y-1.5">
            <li>
              <Link
                href="/desktop"
                className={clsx(
                  "flex items-center p-2.5 rounded-lg transition-colors duration-200 group",
                  {
                    "bg-blue-100/80 text-blue-600": pathname === "/desktop",
                    "hover:bg-gray-200/50 text-gray-600":
                      pathname !== "/desktop",
                  }
                )}
              >
                <Home
                  className={clsx("w-5 h-5 flex-shrink-0", {
                    "mx-auto": isCollapsed,
                  })}
                />
                <span
                  className={clsx(
                    "ml-3 text-[13.5px] font-medium transition-opacity truncate",
                    {
                      "opacity-0 w-0": isCollapsed,
                      "opacity-100": !isCollapsed,
                    }
                  )}
                >
                  桌面
                </span>
              </Link>
            </li>

            <li>
              <Link
                href="/myCloudDisk"
                className={clsx(
                  "flex items-center p-2.5 rounded-lg transition-colors duration-200 group",
                  {
                    "bg-blue-100/80 text-blue-600": pathname === "/myCloudDisk",
                    "hover:bg-gray-200/50 text-gray-600":
                      pathname !== "/myCloudDisk",
                  }
                )}
              >
                <Cloud
                  className={clsx("w-5 h-5 flex-shrink-0", {
                    "mx-auto": isCollapsed,
                  })}
                />
                <span
                  className={clsx(
                    "ml-3 text-[13.5px] font-medium transition-opacity truncate",
                    {
                      "opacity-0 w-0": isCollapsed,
                      "opacity-100": !isCollapsed,
                    }
                  )}
                >
                  我的云盘
                </span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};
