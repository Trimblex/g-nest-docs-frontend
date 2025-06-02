"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Download, Eye } from "lucide-react";
import axios from "@/config/axiosConfig";
import { ShareCheckedVO, ShareInfoBO } from "@/interface/shares";
import { GNestResponse } from "@/interface/common";
import { toast } from "sonner";

interface ShareParams {
  token: string | string[];
  [key: string]: string | string[];
}
export default function SharePage() {
  const params = useParams<ShareParams>();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "ready">("loading");
  const [downloadInfo, setDownloadInfo] = useState<{
    objectName: string;
    url: string;
    fileName: string;
    mimeType?: string; // 添加文件类型信息
  }>();
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDownloadLink = async () => {
      try {
        const res = await axios.get<ShareInfoBO, GNestResponse<ShareCheckedVO>>(
          `/files/checkShareToken?token=${params.token}`
        );
        if (res.code === 401) {
          // 携带当前路径作为 redirect 参数
          const redirectUrl = `/share/${params.token}`;
          router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
          toast.error("需要登录");
          return;
        }

        const data = res.data;
        setDownloadInfo(data);
        setStatus("ready");
      } catch (err: Error | any) {
        setError(err.message || "下载初始化失败");
        setStatus("ready");
      }
    };

    fetchDownloadLink();
  }, [params.token, router]);

  const handleDownload = () => {
    if (!downloadInfo) return;

    // 创建隐藏的iframe触发下载
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = downloadInfo.url;
    document.body.appendChild(iframe);

    // 清理iframe
    setTimeout(() => {
      document.body.removeChild(iframe);
      window.close(); // 下载完成后自动关闭窗口
    }, 5000);
  };

  // 处理在线预览
  const handlePreview = () => {
    if (!downloadInfo || !downloadInfo.objectName) return;

    // 在新标签页打开预览页面
    const previewUrl = `/filePreview/${encodeURIComponent(
      downloadInfo.objectName
    )}`;
    window.open(previewUrl, "_blank");
  };

  // 检查文件是否可预览

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="w-full max-w-md">
        {status === "loading" && (
          <div className="text-center p-8 bg-white rounded-xl shadow-lg">
            <Loader2 className="h-10 w-10 animate-spin mx-auto text-blue-500" />
            <h2 className="mt-4 text-xl font-semibold text-gray-700">
              准备分享内容
            </h2>
            <p className="mt-2 text-gray-500">正在加载文件信息，请稍候...</p>
          </div>
        )}

        {status === "ready" && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {downloadInfo ? (
              <>
                <div className="p-6 text-center bg-gradient-to-r from-blue-100 to-indigo-100">
                  <div className="bg-blue-500/20 p-3 rounded-full inline-block">
                    <Download className="h-10 w-10 text-blue-600 mx-auto" />
                  </div>

                  <h2 className="mt-4 text-xl font-bold text-gray-800">
                    文件已就绪
                  </h2>
                  <p className="mt-2 text-gray-600 font-medium break-all">
                    {downloadInfo.fileName}
                  </p>

                  {downloadInfo.mimeType && (
                    <p className="mt-1 text-sm text-gray-500">
                      类型: {downloadInfo.mimeType.split("/")[1].toUpperCase()}{" "}
                      文件
                    </p>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handleDownload}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="h-5 w-5" />
                      <span className="font-medium">立即下载</span>
                    </button>

                    <button
                      onClick={handlePreview}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Eye className="h-5 w-5" />
                      <span className="font-medium">在线预览</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center">
                <div className="bg-red-500/20 p-3 rounded-full inline-block">
                  <svg
                    className="h-10 w-10 text-red-500 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>

                <h2 className="mt-4 text-xl font-bold text-red-600">
                  下载错误
                </h2>
                <p className="mt-2 text-gray-600">
                  {error || "获取文件时发生错误"}
                </p>

                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  重试
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
