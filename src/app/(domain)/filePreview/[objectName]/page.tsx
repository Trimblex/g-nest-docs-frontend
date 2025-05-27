"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "@/config/axiosConfig";
export default function FilePreviewPage() {
  const params = useParams();
  const [previewUrl, setPreviewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  // 验证用户
  // 安全获取文件路径
  const fetchFilePath = async (objectName: string) => {
    try {
      const response = await axios.post(`/files/getPreviewUrl`, {
        objectName,
      });

      return await response.data;
    } catch (err) {
      toast.error("文件获取失败");
      throw err;
    }
  };

  useEffect(() => {
    const loadPreview = async () => {
      try {
        const objectName = decodeURIComponent(params.objectName as string);

        const res = await fetchFilePath(objectName);
        setPreviewUrl(res);
        setError("");
      } catch (err: Error | any) {
        setError(err.message || "预览加载失败");
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreview();
  }, [params.objectName]);

  return (
    <div className="h-[calc(100vh)] bg-gray-50 relative">
      {/* 加载状态 */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">正在验证文件权限...</p>
          </div>
        </div>
      )}

      {/* 错误状态 */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <div className="text-center p-4 max-w-md">
            <div className="text-2xl mb-2">⚠️ 预览不可用</div>
            <p className="text-muted-foreground">{error}</p>
            <button
              className="mt-4 text-primary underline"
              onClick={() => window.location.reload()}
            >
              重试
            </button>
          </div>
        </div>
      )}

      {/* 预览内容 */}
      {!error && previewUrl && (
        <div className="h-full w-full">
          <iframe
            key={previewUrl}
            src={previewUrl}
            className="h-full w-full border-none"
            sandbox="allow-scripts allow-same-origin"
            allow="accelerometer; encrypted-media; gyroscope;"
            allowFullScreen
          />
        </div>
      )}

      {/* 安全提示 */}
      {/* <div className="absolute bottom-0 left-0 right-0 bg-yellow-50 p-2 text-center text-sm text-yellow-800">
        安全提示：文件内容来自外部服务，请勿执行下载或分享操作
      </div> */}
    </div>
  );
}
