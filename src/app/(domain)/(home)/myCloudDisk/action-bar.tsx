"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GridIcon, ListIcon, RefreshCwIcon } from "lucide-react";
import { UploadFileDialog } from "./upload-file-dialog";
import { CreateFolderDialog } from "./create-folder-dialog";

export const ActionBar = ({
  searchTerm,
  sortBy,
  isRefreshing,
  onSearchChange,
  onSortChange,
  onRefresh,
  pinFoldersTop,
  onPinChange,
  className,
  viewMode,
  onViewChange,
  uploadProgress,
  isUploading,
  onUpload,
  onCreateFolder,
}: {
  searchTerm: string;
  sortBy: "name" | "modifiedAt";
  isRefreshing: boolean;
  onSearchChange: (value: string) => void;
  onSortChange: (value: "name" | "modifiedAt") => void;
  onRefresh: () => void;
  pinFoldersTop: boolean;
  onPinChange: (value: boolean) => void;
  viewMode: "list" | "grid";
  onViewChange: (mode: "list" | "grid") => void;
  uploadProgress: number;
  isUploading: boolean;
  onUpload: (files: File[]) => Promise<void>;
  onCreateFolder: (name: string) => Promise<void>;
  className?: string;
}) => {
  return (
    <div
      className={
        "flex flex-col sm:flex-row gap-4 justify-between items-center" +
        className
      }
    >
      <div className="flex gap-2 order-1">
        <UploadFileDialog
          uploadProgress={uploadProgress}
          onUpload={onUpload}
          isUploading={isUploading}
          className="flex-1"
        />
        <CreateFolderDialog onCreate={onCreateFolder} />
        <Input
          placeholder="筛选结果..."
          className=" w-96 max-w-[300px]"
          value={searchTerm}
          autoComplete="filter-result"
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Button
          variant="outline"
          onClick={onRefresh}
          title="刷新列表"
          disabled={isRefreshing}
          className="box-border min-w-[40px] transition-all"
        >
          <RefreshCwIcon
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
        </Button>
      </div>

      <div className="flex gap-2 justify-end order-3 justify-items-end">
        <Button
          variant={pinFoldersTop ? "default" : "outline"}
          onClick={() => onPinChange(!pinFoldersTop)}
          className="min-w-[120px] box-border transition-all"
        >
          文件夹置顶
        </Button>
        <Button
          variant={sortBy === "modifiedAt" ? "default" : "outline"}
          onClick={() => onSortChange("modifiedAt")}
          className="min-w-[120px] box-border transition-all"
        >
          最近修改
        </Button>
        <Button
          variant={sortBy === "name" ? "default" : "outline"}
          onClick={() => onSortChange("name")}
          className="min-w-[120px] box-border transition-all"
        >
          名称排序
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            onViewChange(viewMode === "list" ? "grid" : "list");
            window.localStorage.setItem(
              "viewMode",
              viewMode === "list" ? "grid" : "list"
            );
          }}
          title="切换视图"
          className="min-w-[40px] p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {viewMode === "list" ? (
            <GridIcon className="h-4 w-4" />
          ) : (
            <ListIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
