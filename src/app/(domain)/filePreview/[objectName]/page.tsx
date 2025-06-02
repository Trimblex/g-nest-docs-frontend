"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  File,
  FileArchive,
  RefreshCw,
  Download,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { toast } from "sonner";
import axios from "@/config/axiosConfig";
import { FileInfoVO } from "@/interface/files";
import { formatDate, formatFileSize } from "@/lib/utils";

export default function FilePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState("");
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [iframeLoading, setIframeLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileInfo, setFileInfo] = useState<FileInfoVO>();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 引用预览容器
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // 格式化文件大小

  // 获取文件数据
  const fetchFileData = useCallback(
    async (objectName: string) => {
      try {
        const response = await axios.post(`/files/getPreviewUrl`, {
          objectName,
        });
        const infoResponse = await axios.post(`/files/getFileInfo`, {
          objectName,
        });

        return {
          previewUrl: response.data,
          fileInfo: infoResponse.data,
        };
      } catch (err) {
        toast.error("文件获取失败");
        throw err;
      }
    },
    [formatFileSize]
  );

  // 加载预览
  const loadPreview = useCallback(async () => {
    try {
      setIframeLoading(true);
      const objectName = decodeURIComponent(params.objectName as string);
      const { previewUrl, fileInfo } = await fetchFileData(objectName);
      setPreviewUrl(previewUrl);
      setFileInfo(fileInfo);
      setError("");
    } catch (err: any) {
      setError(err.message || "预览加载失败");
    } finally {
      setIsInitialLoading(false);
      // 延迟隐藏加载状态，避免闪烁
      setTimeout(() => setIframeLoading(false), 300);
    }
  }, [params.objectName, fetchFileData]);

  useEffect(() => {
    loadPreview();

    // 监听全屏变化事件
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement === previewContainerRef.current
      );
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange
      );
    };
  }, [loadPreview]);

  // 切换全屏
  const toggleFullscreen = () => {
    if (!previewContainerRef.current) return;

    if (isFullscreen) {
      // 退出全屏
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    } else {
      // 进入全屏
      const element = previewContainerRef.current;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        (element as any).webkitRequestFullscreen();
      } else if ((element as any).msRequestFullscreen) {
        (element as any).msRequestFullscreen();
      }
    }
  };

  // 刷新预览窗口
  const refreshPreview = () => {
    // 保留文件信息，只刷新预览
    setPreviewUrl("");
    setIframeLoading(true);
    setTimeout(() => {
      loadPreview();
    }, 100);
  };

  // 下载文件
  const handleDownload = () => {
    if (!fileInfo || !fileInfo.id) {
      toast.error("无法下载，文件信息缺失");
      return;
    }

    toast.promise(
      axios
        .post(
          `/files/download`,
          { ids: [fileInfo.id] },
          { responseType: "blob" }
        )
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", fileInfo?.name ?? "文件下载");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }),
      {
        loading: "开始下载文件...",
        success: "文件下载成功！",
        error: "文件下载失败",
      }
    );
  };

  const showLoader = isInitialLoading || iframeLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* 文件信息卡片 */}
          <div className="border-b border-gray-200 p-4 md:p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <File className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 truncate max-w-[250px] sm:max-w-md">
                    {fileInfo?.name || "待预览文件"}
                  </h2>
                  <div className="flex flex-wrap gap-2 mt-1 text-sm text-gray-500">
                    {fileInfo?.size && (
                      <span>大小: {formatFileSize(fileInfo.size)}</span>
                    )}
                    {fileInfo?.mimeType && (
                      <span>类型: {fileInfo.mimeType}</span>
                    )}
                    {fileInfo?.createdAt && (
                      <span>上传时间: {formatDate(fileInfo?.createdAt)}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 ">
                <button
                  onClick={refreshPreview}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  刷新预览
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  下载文件
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
                >
                  {isFullscreen ? (
                    <>
                      <Minimize2 className="h-4 w-4" />
                      退出全屏
                    </>
                  ) : (
                    <>
                      <Maximize2 className="h-4 w-4" />
                      全屏预览
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 预览内容区域 - 添加ref用于全屏控制 */}
          <div
            className="relative"
            style={{ height: "70vh" }}
            ref={previewContainerRef}
          >
            {/* 加载状态 */}
            {showLoader && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-50">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                  </div>
                  <p className="text-lg font-medium text-gray-700">
                    {isInitialLoading
                      ? "正在准备预览..."
                      : "正在加载文件内容..."}
                  </p>
                  {!isInitialLoading && (
                    <p className="text-sm text-gray-500 mt-1 max-w-md text-center">
                      刷新预览可能需要一些时间，请耐心等待
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* 错误状态 */}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-50 p-4">
                <div className="text-center max-w-md">
                  <div className="inline-flex items-center justify-center bg-red-100 p-3 rounded-full mb-4">
                    <svg
                      className="h-12 w-12 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    预览不可用
                  </h3>
                  <p className="text-gray-600 mb-6">{error}</p>
                  <div className="flex justify-center gap-3">
                    <button
                      className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      onClick={refreshPreview}
                    >
                      重新加载
                    </button>
                    <button
                      className="px-5 py-2 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      onClick={handleDownload}
                    >
                      下载文件
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 预览iframe */}
            {!error && previewUrl && (
              <div className="h-full w-full">
                <iframe
                  key={previewUrl + Date.now()} // 确保每次刷新都是新的iframe
                  src={previewUrl}
                  className="h-full w-full border-none"
                  sandbox="allow-scripts allow-same-origin allow-popups"
                  allow="accelerometer; encrypted-media; gyroscope;"
                  allowFullScreen
                  onLoad={() => setIframeLoading(false)}
                  onError={() => setError("内容加载失败，请尝试刷新")}
                />
              </div>
            )}
          </div>

          {/* 使用提示 */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 text-sm text-gray-500">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-1.5">
                <svg
                  className="h-4 w-4 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>点击压缩包内文件可查看内容（新标签页打开）</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg
                  className="h-4 w-4 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>下载完整文件查看所有内容</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="mt-12 py-6 text-center text-gray-500 text-sm">
        <div className="container mx-auto px-4">
          <p>© 2025银河云文档预览服务</p>
        </div>
      </footer>
    </div>
  );
}
