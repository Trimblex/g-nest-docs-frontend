"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Download } from "lucide-react";
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
    url: string;
    fileName: string;
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {status === "loading" && (
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-4">正在准备下载链接...</p>
        </div>
      )}

      {status === "ready" && (
        <div className="text-center max-w-md">
          {downloadInfo ? (
            <>
              <Download className="h-12 w-12 mx-auto text-blue-500 mb-4" />
              <h2 className="text-xl font-semibold">文件已就绪</h2>
              <p className="mt-2 text-gray-600 break-all">
                {downloadInfo.fileName}
              </p>
              <button
                onClick={handleDownload}
                className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                立即下载
              </button>
            </>
          ) : (
            <div className="text-red-500">
              <h2 className="text-xl font-bold">下载错误</h2>
              <p className="mt-2">{error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
