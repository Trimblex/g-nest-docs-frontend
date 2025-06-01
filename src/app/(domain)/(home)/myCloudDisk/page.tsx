"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { Breadcrumbs } from "./bread-crumbs";
import { ActionBar } from "./action-bar";
import { StorageCard } from "./storage-card";
import { ActivityCard } from "./activity-card";
import { toast } from "sonner";
import axios from "@/config/axiosConfig";
import { ActivityLogVO, FileInfoVO } from "@/interface/files";
import { useSearchParam } from "@/hooks/use-search-param";
import { FileTable } from "./file-table";
import { HeaderSection } from "./header-section";
import { FileGrid } from "./file-grid";
import { ArrowUp, Download, Move, Share, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "./confirm-delete-dialog";
import { MoveDialog } from "./move-dialog";
import { ShareDialog } from "./share-dialog";
import { useAuth } from "@/providers/auth-context";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
export default function CloudDiskPage() {
  const [search] = useSearchParam();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [files, setFiles] = useState<FileInfoVO[]>([]);
  const [currentFileId, setCurrentFileId] = useState<string>(
    searchParams.get("id") || "0"
  );
  const [pathHierarchy, setPathHierarchy] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "modifiedAt">("modifiedAt");
  const [usedSpace, setUsedSpace] = useState(0); // GB
  const [activities, setActivities] = useState<ActivityLogVO[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [pinFoldersTop, setPinFoldersTop] = useState(false);

  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);

  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { token } = useAuth();
  useEffect(() => {
    const savedMode = localStorage.getItem("viewMode") as
      | "list"
      | "grid"
      | null;
    if (savedMode) setViewMode(savedMode);
  }, []);
  const loadData = useCallback(
    async (loadMore: boolean) => {
      try {
        loadMore ? setIsLoadingMore(true) : setIsLoading(true);
        const params = {
          fileId: currentFileId,
          search: search || searchTerm,
          pageSize: 10,
          cursor: loadMore ? cursor : null,
          orderBy: sortBy,
          pinFoldersTop: pinFoldersTop,
        };
        const response = await axios.post("/files/paginated", params);
        const data = response.data;
        const newFiles = data.results;
        const nextCursor = data.nextCursor;
        const hasMore = data.hasMore;
        if (loadMore) {
          setFiles((prev) => [...prev, ...newFiles]);
        } else {
          setFiles(newFiles);
        }
        setCursor(nextCursor);
        setHasMore(hasMore);
      } catch (error) {
        toast.error("加载数据失败");
        console.error(error);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [currentFileId, searchTerm, sortBy, pinFoldersTop, cursor, search]
  );
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    setShowScrollToTop(scrollTop > 150);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const handleFileSelect = useCallback(
    (fileId: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const isShift = e.shiftKey;
      const isCtrl = e.ctrlKey || e.metaKey;

      setSelectedIds((prev) => {
        let newSelected = [...prev];
        const filesIds = files.map((f) => f.id);
        const currentIndex = filesIds.indexOf(fileId);

        if (isShift && lastSelectedId) {
          const lastIndex = filesIds.indexOf(lastSelectedId);
          if (lastIndex > -1 && currentIndex > -1) {
            const start = Math.min(lastIndex, currentIndex);
            const end = Math.max(lastIndex, currentIndex);
            newSelected = Array.from(
              new Set([
                ...newSelected,
                ...files.slice(start, end + 1).map((f) => f.id),
              ])
            );
          }
        } else if (isCtrl) {
          const index = newSelected.indexOf(fileId);
          index > -1 ? newSelected.splice(index, 1) : newSelected.push(fileId);
        } else {
          newSelected = [fileId];
        }
        setLastSelectedId(fileId);
        return newSelected;
      });
    },
    [files, lastSelectedId]
  );

  const handleBatchDelete = useCallback(() => {
    handleDelete(selectedIds);
    setSelectedIds([]);
  }, [selectedIds]);

  const handleBatchMove = useCallback(
    (ids: string[], parentId: string) => {
      handleMove(ids, parentId);
      setSelectedIds([]);
    },
    [selectedIds]
  );

  const debounce = useCallback((func: () => void, wait: number) => {
    let timeout: NodeJS.Timeout | null = null;
    return () => {
      timeout && clearTimeout(timeout);
      timeout = setTimeout(func, wait);
    };
  }, []);
  const handleLoadMore = useCallback(() => {
    setIsLoadingMore(true);
    setTimeout(() => {
      loadData(true);
    }, 500);
  }, [loadData]);
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const threshold = 100;
      const isNearBottom =
        scrollHeight - (scrollTop + clientHeight) < threshold;

      if (isNearBottom && hasMore && !isLoadingMore) {
        handleLoadMore();
      }
    };
    const debouncedHandler = debounce(handleScroll, 150);
    scrollContainer.addEventListener("scroll", debouncedHandler);

    return () =>
      scrollContainer.removeEventListener("scroll", debouncedHandler);
  }, [hasMore, isLoadingMore, debounce, handleLoadMore]);

  const loadUsedSpace = async () => {
    axios.get(`/files/getUsedSpace`).then((res) => {
      setUsedSpace(res.data ?? 0);
    });
  };
  const loadActivities = async () => {
    try {
      const response = await axios.get(
        `/files/getActivityLog?fileId=${currentFileId}`
      );

      setActivities(response.data);
    } catch (error) {
      toast.error("加载活动失败");
      console.error("加载活动失败:", error);
    }
  };

  const loadPathHierarchy = async () => {
    try {
      const response = await axios.post(`/files/path`, {
        fileId: currentFileId,
      });

      setPathHierarchy(response.data);
      Promise.resolve(() => {});
    } catch (error) {
      toast.error("无法加载路径信息");
      console.error("无法加载路径信息:", error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("id", currentFileId);
    router.replace(`?${params.toString()}`, { scroll: false });

    loadPathHierarchy();
    loadActivities();
    loadData(false);
    loadUsedSpace();
  }, [currentFileId, searchTerm, search, sortBy, pinFoldersTop]);

  const handleUpload = async (files: File[]) => {
    if (files.length === 0) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("parentId", currentFileId);
      files.forEach((file) => formData.append("files", file));

      const response = await axios.post("/files/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setUploadProgress(progress);
        },
      });

      const result = response.data;

      if (!result || result.length === 0) {
        throw new Error(result.error || "所有文件上传均失败");
      }
      setFiles((prevFiles) => [...prevFiles, ...result]);
    } catch (error: Error | any) {
      toast.error(error.message);
      throw new Error(error.response?.data?.error || error.message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const createFolder = async (name: string) => {
    try {
      const response = await axios.put("/files/createFolder", {
        name,
        parentId: currentFileId,
      });
      setFiles((prev) => [...prev, response.data]);
    } catch (error) {
      toast.error("创建失败");
      console.log(error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setIsLoading(true);
    try {
      await loadData(false);
      toast.success("列表已刷新");
    } catch (error) {
      toast.error("刷新失败");
      console.log(error);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  const handleMove = async (ids: string[], parentId: string) => {
    try {
      const res = await axios.patch("/files/move", { ids, parentId });
      const resIds = res.data.map((it: FileInfoVO) => it.id);
      setFiles((prev) => prev.filter((file) => !resIds.includes(file.id)));
      toast.success("移动成功");
    } catch (error) {
      toast.error("移动失败");
      console.error(error);
    }
  };

  const handleRename = async (
    id: string,
    oldName: string,
    newName: string,
    type: "FILE" | "FOLDER"
  ) => {
    if (oldName === newName) return;
    try {
      const res = await axios.patch("/files/rename", {
        id,
        name: newName,
        type,
      });
      const resId = res.data.id;

      setFiles((prev) =>
        prev.map((file) =>
          file.id === resId
            ? {
                ...file,
                name: newName,
              }
            : file
        )
      );
    } catch (error) {
      toast.error("重命名失败");
      console.error(error);
    }
  };
  const handleDelete = async (ids: string[]) => {
    try {
      const res = await axios.post(`/files/delete`, {
        ids,
      });
      const resIds = res.data.map((it: FileInfoVO) => it.id);
      setFiles((prev) => prev.filter((file) => !resIds.includes(file.id)));
    } catch (error) {
      toast.error("删除失败");
      console.error(error);
    }
  };

  const handleDownload = useCallback(async (ids: string[]) => {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      toast.success("开始下载处理...");

      const response = await fetch(`${API_BASE}/files/download`, {
        method: "POST",
        headers,
        body: JSON.stringify({ ids }),
      });

      // 处理错误响应
      if (!response.ok || !response.body) {
        const errorText = await response.text();
        throw new Error(errorText || `下载失败，状态码: ${response.status}`);
      }

      console.log("Response Headers:");
      for (const [key, value] of response.headers.entries()) {
        console.log(`${key}: ${value}`);
      }

      // 优化文件名解析逻辑 - 兼容RFC 5987标准
      const parseFileNameFromHeaders = (headers: Headers) => {
        const contentDisposition = headers.get("Content-Disposition") || "";
        console.log("Content-Disposition:", contentDisposition);

        // 1. 优先解析RFC 5987标准格式 (filename*=UTF-8'')
        const rfc5987Match = contentDisposition.match(
          /filename\*=utf-8''([^;]+)/i
        );
        if (rfc5987Match && rfc5987Match[1]) {
          try {
            return decodeURIComponent(rfc5987Match[1]);
          } catch (e) {
            console.warn("RFC 5987文件名解码失败，使用原始值", e);
            return rfc5987Match[1];
          }
        }

        // 2. 次优解析带引号的格式 (filename="...")
        const quotedMatch = contentDisposition.match(/filename="([^"]+)"/i);
        if (quotedMatch && quotedMatch[1]) {
          return quotedMatch[1].replace(/\\"/g, '"');
        }

        // 3. 最后解析无引号格式 (filename=...)
        const unquotedMatch = contentDisposition.match(/filename=([^;]+)/i);
        if (unquotedMatch && unquotedMatch[1]) {
          return unquotedMatch[1];
        }

        // 4. 默认文件名
        return "download.zip";
      };

      const fileName = parseFileNameFromHeaders(response.headers);
      console.log("Parsed filename:", fileName);

      // 使用流式API处理响应
      const reader = response.body.getReader();
      const contentLength = response.headers.get("Content-Length");
      const stream = new ReadableStream({
        async start(controller) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
          controller.close();
        },
      });

      // 创建blob URL（兼容流式）
      const blob = await new Response(stream).blob();
      const url = window.URL.createObjectURL(blob);

      // 创建下载链接
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      // 清理资源
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
        toast.success(`下载完成: ${fileName}`);
      }, 100);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "下载失败，请检查网络连接";
      toast.error(errorMessage);
      console.error("下载错误:", error);
    }
  }, []);

  const handleBatchDownload = () => {
    if (selectedIds.length === 0) {
      toast.warning("请选择要下载的文件");
      return;
    }
    handleDownload(selectedIds);
  };

  return (
    <>
      <div className="p-6 space-y-5 max-w-7xl mx-auto">
        <HeaderSection usedSpace={usedSpace} />
        <Breadcrumbs
          pathHierarchy={pathHierarchy}
          onClick={(id) => setCurrentFileId(id)}
          className="mt-2"
        />
        <ActionBar
          searchTerm={searchTerm}
          sortBy={sortBy}
          isRefreshing={isRefreshing}
          onSearchChange={setSearchTerm}
          onSortChange={setSortBy}
          onRefresh={handleRefresh}
          pinFoldersTop={pinFoldersTop}
          onPinChange={setPinFoldersTop}
          viewMode={viewMode}
          onViewChange={setViewMode}
          uploadProgress={uploadProgress}
          isUploading={isUploading}
          onUpload={handleUpload}
          onCreateFolder={createFolder}
          className="bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-lg"
        />

        <Card className="shadow-sm h-[60vh]">
          <CardContent className="p-0 relative h-full">
            <div
              className="h-full overflow-y-auto 
                        [&::-webkit-scrollbar]:w-2
                        [&::-webkit-scrollbar]:h-2
                        [&::-webkit-scrollbar-track]:rounded-full
                        [&::-webkit-scrollbar-track]:bg-gray-50     
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        [&::-webkit-scrollbar-thumb]:bg-gray-300    
                        hover:[&::-webkit-scrollbar-thumb]:bg-gray-400  
                        dark:[&::-webkit-scrollbar-track]:bg-gray-800
                        dark:[&::-webkit-scrollbar-thumb]:bg-gray-500   
                        dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-400"
              ref={scrollContainerRef}
            >
              {viewMode === "list" ? (
                <FileTable
                  files={files}
                  isLoading={isLoading}
                  isLoadingMore={isLoadingMore}
                  onRename={handleRename}
                  onDelete={handleDelete}
                  onFolderClick={(id) => setCurrentFileId(id)}
                  pathHierarchy={pathHierarchy}
                  onMove={handleMove}
                  onDownload={handleDownload}
                  hasMore={hasMore}
                  selectedIds={selectedIds}
                  onSelect={handleFileSelect}
                />
              ) : (
                <FileGrid
                  files={files}
                  isLoading={isLoading}
                  isLoadingMore={isLoadingMore}
                  onRename={handleRename}
                  onDelete={handleDelete}
                  onFolderClick={(id) => setCurrentFileId(id)}
                  pathHierarchy={pathHierarchy}
                  onMove={handleMove}
                  onDownload={handleDownload}
                  hasMore={hasMore}
                  selectedIds={selectedIds}
                  onSelect={handleFileSelect}
                />
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <StorageCard usedSpace={usedSpace} className="h-full" />
          <ActivityCard activities={activities} className="h-full" />
        </div>

        {/* 公共批量操作栏 */}
        {selectedIds.length > 1 && (
          <div
            className={`
              fixed bottom-6 left-1/2 -translate-x-1/2 
              bg-gray-300/50  dark:bg-gray-800/90 
              backdrop-blur-lg backdrop-saturate-150
              p-3 rounded-xl 
              shadow-lg shadow-gray-400/20 dark:shadow-black/40
              border border-gray-200 dark:border-gray-700
              flex items-center gap-3
              transition-all duration-300
              animate-in fade-in slide-in-from-bottom-4
              z-50
            `}
          >
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              已选择{" "}
              <span className="font-bold text-primary">
                {selectedIds.length}
              </span>{" "}
              个文件
            </span>

            <div className="h-5 border-l border-gray-300 dark:border-gray-600" />

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBatchDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-blue-50/50 dark:hover:bg-blue-900/30 transition-colors"
              >
                <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>下载</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.error("抱歉，此功能正在开发中~~~")}
                className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/30 transition-colors"
              >
                <Share className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>分享</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMoveDialog(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-green-50/50 dark:hover:bg-green-900/30 transition-colors"
              >
                <Move className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span>移动</span>
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 transition-colors hover:shadow-md hover:shadow-red-500/10"
              >
                <Trash className="w-4 h-4" />
                <span>删除</span>
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedIds([])}
              className="ml-1 px-3 py-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
            >
              取消选择
            </Button>
          </div>
        )}
      </div>

      <ConfirmDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        fileName={`${selectedIds.length}个文件`}
        onConfirm={handleBatchDelete}
      />
      <MoveDialog
        open={showMoveDialog}
        onOpenChange={setShowMoveDialog}
        currentFileIds={selectedIds}
        parentId={files[0]?.parentId ?? "0"}
        pathHierarchy={pathHierarchy}
        onMove={handleBatchMove}
      />
      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        titleName="..."
        fileIds={selectedIds}
      />
      {/* 添加置顶按钮 */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-white dark:bg-gray-700 shadow-lg border hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
          aria-label="返回顶部"
        >
          <ArrowUp className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </button>
      )}
    </>
  );
}
