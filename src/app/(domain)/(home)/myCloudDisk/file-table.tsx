import { FileRow } from "./file-row";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileInfoVO } from "@/interface/files";
import { Loader2, FolderOpenIcon } from "lucide-react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
export const FileTable = ({
  files,
  isLoading,
  isLoadingMore,
  onRename,
  onDelete,
  onFolderClick,
  pathHierarchy,
  onMove,
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
  onMove: (ids: string[], parentId: string) => void;
  hasMore: boolean;
  selectedIds: string[];
  onSelect: (fileId: string, e: React.MouseEvent) => void;
}) => {
  return (
    <DndProvider backend={HTML5Backend}>
      {/* <div className="relative h-full"> */}
      <Table className="relative w-full overflow-x-auto">
        <TableHeader className="bg-gray-50 dark:bg-gray-800 sticky top-0 pr-4">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[45%] font-medium">名称</TableHead>
            <TableHead className="w-[15%]">类型</TableHead>
            <TableHead className="w-[15%]">大小</TableHead>
            <TableHead className="w-[15%]">修改时间</TableHead>
            <TableHead className="w-[10%] text-right">操作</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y">
          {isLoading && !hasMore && <LoadingState />}
          {!isLoading && files.length === 0 && <EmptyState />}
          {!isLoading &&
            files.map((file) => (
              <FileRow
                key={file.id}
                file={file}
                onRename={onRename}
                onDelete={onDelete}
                onFolderClick={onFolderClick}
                isSelected={selectedIds.includes(file.id)}
                onClick={onSelect}
                pathHierarchy={pathHierarchy}
                onMove={onMove}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              />
            ))}
          {/* 加载状态行 */}
          {hasMore && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={5} className="h-6 text-center">
                {isLoadingMore ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground inline-block" />
                ) : (
                  <span className="text-sm text-muted-foreground">
                    滚动加载更多
                  </span>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* </div> */}
    </DndProvider>
  );
};

const LoadingState = () => (
  <TableRow>
    <TableCell colSpan={5} className="h-48 text-center">
      <div className="flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="text-gray-500">加载中...</span>
      </div>
    </TableCell>
  </TableRow>
);

const EmptyState = () => (
  <TableRow>
    <TableCell colSpan={5} className="h-48 text-center">
      <div className="flex flex-col items-center space-y-2 text-gray-400">
        <FolderOpenIcon className="h-12 w-12" />
        <p className="text-sm">当前文件夹没有内容</p>
      </div>
    </TableCell>
  </TableRow>
);
