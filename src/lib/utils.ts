import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateString = (dateString: string) =>
  format(new Date(dateString), "yyyy年MM月dd日 HH:mm", { locale: zhCN });

export const formatDate = (data: Date) =>
  format(data, "yyyy年MM月dd日 HH:mm", { locale: zhCN });
export const truncateName = (name: string, maxLen = 28) => {
  const [base, ext] = getFileNameParts(name);
  if (name.length <= maxLen) return name;

  // 可用基础部分长度 = 总限制 - 扩展名长度 - 省略号长度(1)
  const availableLength = maxLen - ext.length - 1;

  if (availableLength <= 0) {
    return `...${ext.slice(-maxLen)}`; // 极端情况保护
  }
  return `${base.slice(0, availableLength)}...${ext}`;
};

export const getFileNameParts = (name: string) => {
  const lastDotIndex = name.lastIndexOf(".");
  return lastDotIndex > 0
    ? [name.slice(0, lastDotIndex), name.slice(lastDotIndex + 1)]
    : [name, ""];
};
