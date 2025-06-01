"use client";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FileInfoVO } from "@/interface/files";
import { FileGridItem } from "./file-grid-item";
import { Loader2, FolderOpenIcon } from "lucide-react";

export const FileGrid = ({
  files,
  isLoading,
  isLoadingMore,
  onRename,
  onDelete,
  onFolderClick,
  pathHierarchy,
  onMove,
  onDownload,
  hasMore,
  selectedIds,
  onSelect,
}: {
  files: FileInfoVO[];
  isLoading: boolean;
  isLoadingMore: boolean;
  onRename: (
    id: string,
    oldName: string,
    newName: string,
    type: "FILE" | "FOLDER"
  ) => void;
  onDelete: (ids: string[]) => void;
  onFolderClick: (id: string) => void;
  pathHierarchy: Array<{ id: string; name: string }>;
  onMove: (ids: string[], targetId: string) => void;
  onDownload: (fileIds: string[]) => void;
  hasMore: boolean;
  selectedIds: string[];
  onSelect: (fileId: string, e: React.MouseEvent) => void;
}) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 p-4">
        {isLoading && !hasMore && <LoadingState />}
        {!isLoading && files.length === 0 && <EmptyState />}
        {!isLoading &&
          files.map((file) => (
            <FileGridItem
              key={file.id}
              file={file}
              onRename={onRename}
              onDelete={onDelete}
              onFolderClick={onFolderClick}
              isSelected={selectedIds.includes(file.id)}
              onClick={onSelect}
              onDownload={onDownload}
              pathHierarchy={pathHierarchy}
              onMove={onMove}
              selectedIds={selectedIds}
            />
          ))}
      </div>

      {/* 底部加载指示器 */}
      {hasMore && (
        <div className="col-span-full flex items-center justify-center p-4">
          {isLoadingMore ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <span className="text-sm text-muted-foreground">滚动加载更多</span>
          )}
        </div>
      )}
    </DndProvider>
  );
};

const LoadingState = () => (
  <div className="col-span-full h-48 flex flex-col items-center justify-center space-y-3">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <span className="text-gray-500">加载中...</span>
  </div>
);

const EmptyState = () => (
  <div className="col-span-full h-48 flex flex-col items-center justify-center space-y-2 text-gray-400">
    <FolderOpenIcon className="h-12 w-12" />
    <p className="text-sm">当前文件夹没有内容</p>
  </div>
);
