"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "@/config/axiosConfig";

export default function FilePreviewPage() {
  const params = useParams();
  const [previewUrl, setPreviewUrl] = useState("");
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFilePath = async (objectName: string) => {
    try {
      const response = await axios.post(`/files/getPreviewUrl`, { objectName });
      return response.data;
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
      } catch (err: any) {
        setError(err.message || "预览加载失败");
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadPreview();
  }, [params.objectName]);

  const showLoader = isInitialLoading || (previewUrl && iframeLoading);

  return (
    // 修改1：外层容器添加overflow-hidden防止页面滚动
    <div className="h-screen bg-gray-50 relative overflow-hidden">
      {/* 修改2：加载层添加overflow-hidden */}
      {showLoader && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-50 overflow-hidden">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">
              {isInitialLoading ? "正在准备预览..." : "正在加载文件内容..."}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-50 overflow-hidden">
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

      {/* 修改3：iframe容器添加overflow-hidden */}
      {!error && previewUrl && (
        <div className="h-full w-full overflow-hidden">
          <iframe
            key={previewUrl}
            src={previewUrl}
            className="h-full w-full border-none overflow-hidden"
            sandbox="allow-scripts allow-same-origin"
            allow="accelerometer; encrypted-media; gyroscope;"
            allowFullScreen
            onLoad={() => setIframeLoading(false)}
            onError={() => setError("内容加载失败，请尝试刷新")}
            // 修改4：强制隐藏滚动条的终极解决方案
            style={{ overflow: "hidden" }}
          />
        </div>
      )}
    </div>
  );
}
