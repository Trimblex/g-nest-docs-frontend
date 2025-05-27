"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "@/config/axiosConfig";
import { toast } from "sonner";
import { GNestResponse } from "@/interface/common";

export default function OrgInvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get("token");

    // 检查token是否存在
    if (!token || typeof token !== "string") {
      toast.error("无效的邀请链接");
      setIsLoading(false);
      return;
    }

    const handleOrgJoin = async () => {
      try {
        const response = await axios.get<null, GNestResponse<string>>(
          `/org/join/${token}`
        );

        if (response.code === 4001) {
          const redirectPath = `/org/invite?token=${token}`; // 保持当前路径
          router.push(`/register?redirect=${encodeURIComponent(redirectPath)}`);
          toast.error("请先注册");
          return;
        }
        // 处理需要登录的情况
        if (response.code === 401) {
          const redirectPath = `/org/invite?token=${token}`; // 保持当前路径
          router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`);
          toast.error("请先登录后再进行操作");
          return;
        }

        // 处理成功情况
        if (response.code === 200) {
          toast.success("成功加入组织！");
          router.push(`/desktop?org=${response.data}`);
          return;
        }

        // 处理其他错误代码
        toast.error(response.message || "操作失败");
      } catch (error: Error | any) {
        // 处理网络错误

        toast.error(error.message || "操作失败");
      } finally {
        setIsLoading(false);
      }
    };

    handleOrgJoin();
  }, [router, searchParams]);

  // 加载状态显示
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg font-medium">正在验证邀请链接...</div>
      </div>
    );
  }

  // 非加载状态默认不显示内容（通常已经跳转）
  return null;
}
