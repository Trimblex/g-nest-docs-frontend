"use client";
import { useCallback, useEffect, useState } from "react";
import { Check, MoreVertical } from "lucide-react";
import { FileNameDisplay } from "./file-name-display";
import { MenuContent } from "./menu-content";
import { ConfirmDeleteDialog } from "./confirm-delete-dialog";
import { MoveConfirmDialog } from "./move-confirm-dialog";
import { useDragAndDrop } from "@/hooks/use-drag-drop";
import { formatDate } from "@/lib/utils";
import { ShareDialog } from "./share-dialog";
import { MoveDialog } from "./move-dialog";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { FileInfoVO } from "@/interface/files";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { DetailInfoDialog } from "./detail-info-dialog";
import { FileIcon } from "./file-icon";
import { FaFolder } from "react-icons/fa";
import Image from "next/image";

export const FileGridItem = ({
  file,
  pathHierarchy,
  onRename,
  onDelete,
  onFolderClick,
  isSelected,
  onClick,
  onMove,
}: {
  file: FileInfoVO;
  pathHierarchy: Array<{ id: string; name: string }>;
  onRename: (
    id: string,
    oldName: string,
    newName: string,
    type: "FILE" | "FOLDER"
  ) => void;
  onDelete: (id: string[]) => void;
  onFolderClick: (id: string) => void;
  isSelected: boolean;
  onClick: (fileId: string, e: React.MouseEvent) => void;
  onMove: (ids: string[], targetId: string) => void;
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [detailInfoDialogOpen, setDetailInfoDialogOpen] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [file.fileType]);
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onClick(file.id, e);
    },
    [file.id, onClick]
  );
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (file.type === "FOLDER") {
        onFolderClick(file.id);
      } else {
        if (file.objectName) {
          window.open(
            `/filePreview/${encodeURIComponent(file.objectName)}`,
            "_blank"
          );
        }
      }
    },
    [file, onFolderClick]
  );
  const {
    isDragging,
    isOver,
    setRefs,
    pendingMove,
    handleConfirmMove,
    setPendingMove,
  } = useDragAndDrop(file, onMove);

  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setMenuPosition({ x: event.clientX, y: event.clientY });
    setContextMenuOpen(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = () =>
      contextMenuOpen && setContextMenuOpen(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [contextMenuOpen]);

  const handleRename = useCallback(
    (newName: string) => {
      const finalName =
        file.type === "FOLDER"
          ? newName
          : `${newName}${file.fileType ? `.${file.fileType}` : ""}`;
      onRename(file.id, file.name, finalName, file.type);
      setIsRenaming(false);
    },
    [file, onRename]
  );

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          ref={setRefs}
          onContextMenu={handleContextMenu}
          onDoubleClick={handleDoubleClick}
          onClick={handleClick}
          className={cn(
            "group relative",
            "p-3 rounded-xl border-2",
            "hover:border-primary hover:shadow-lg",
            "transition-all duration-200 ease-in-out",
            "flex flex-col items-center",
            "h-full w-full",
            "bg-background/80 hover:bg-background",
            isSelected ? "border-primary bg-primary/10 " : "border-muted/30",
            isOver && "bg-accent/20",
            isDragging && "opacity-60 scale-95"
          )}
        >
          {/* 顶部操作按钮 */}
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="p-1 rounded-full hover:bg-accent">
                <MoreVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </DropdownMenuTrigger>

              <MenuContent
                file={file}
                isContextMenu={false}
                onRename={() => setIsRenaming(true)}
                onDelete={() => setDeleteDialogOpen(true)}
                onShare={() => setShareDialogOpen(true)}
                onMove={() => setMoveDialogOpen(true)}
                onDetail={() => setDetailInfoDialogOpen(true)}
              />
            </DropdownMenu>
          </div>
          {/* 文件图标 */}
          <div className="h-20 flex items-center justify-center mb-2 relative">
            {file.type === "FOLDER" ? (
              <FaFolder className="w-14 h-14 text-blue-500/90" />
            ) : (
              <>
                {["jpg", "jpeg", "png", "gif", "webp"].includes(
                  file.fileType?.toLowerCase() ?? ""
                ) ? (
                  <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-lg">
                    {/* 使用 state 管理加载状态 */}
                    <div className="relative w-full h-full">
                      <Image
                        src={file.filePath ?? ""}
                        alt={file.name}
                        width={500}
                        height={500}
                        className={cn(
                          "object-cover w-full h-full",
                          imageLoaded ? "opacity-100" : "opacity-0"
                        )}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageLoaded(false)}
                      />
                      {/* 仅在加载失败时显示图标 */}
                      {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
                          <FileIcon
                            extension={file.fileType}
                            className="w-14 h-14 text-muted-foreground"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <FileIcon
                    extension={file.fileType}
                    className="w-14 h-14 text-muted-foreground"
                  />
                )}
              </>
            )}
          </div>
          {/* 文件信息 */}
          <div className="w-full text-center space-y-1">
            <FileNameDisplay
              file={file}
              isRenaming={isRenaming}
              onRename={handleRename}
              maxLen={8}
              className="text-xs font-medium px-2 py-1 rounded-md hover:bg-accent/30 transition-colors truncate max-w-[90%] mx-auto"
            />
            <div className="text-xs text-muted-foreground/80 space-y-0.5">
              <p className="truncate">{formatDate(file.modifiedAt)}</p>
              {file.type === "FILE" && <p className="font-mono">{file.size}</p>}
            </div>
          </div>
          {/* 选中指示器 */}
          {isSelected && (
            <div className="absolute top-1 left-1">
              <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <Check className="h-3 w-3 text-primary-foreground" />
              </div>
            </div>
          )}
        </div>
      </ContextMenuTrigger>

      {/* 右键菜单和其他对话框 */}
      <DropdownMenu open={contextMenuOpen} onOpenChange={setContextMenuOpen}>
        <MenuContent
          file={file}
          isContextMenu
          position={menuPosition}
          onRename={() => setIsRenaming(true)}
          onDelete={() => setDeleteDialogOpen(true)}
          onShare={() => setShareDialogOpen(true)}
          onMove={() => setMoveDialogOpen(true)}
          onDetail={() => setDetailInfoDialogOpen(true)}
        />
      </DropdownMenu>

      <MoveConfirmDialog
        pendingMove={pendingMove}
        targetName={file.name}
        onConfirm={handleConfirmMove}
        onCancel={() => setPendingMove(null)}
      />

      <ShareDialog
        fileIds={[...[file.id]]}
        titleName={file.name}
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
      />

      <ConfirmDeleteDialog
        fileName={file.name}
        open={deleteDialogOpen}
        onConfirm={() => onDelete([...[file.id]])}
        onOpenChange={setDeleteDialogOpen}
      />

      <MoveDialog
        open={moveDialogOpen}
        onOpenChange={setMoveDialogOpen}
        currentFileIds={[...[file.id]]}
        parentId={file.parentId}
        pathHierarchy={pathHierarchy}
        onMove={onMove}
      />
      <DetailInfoDialog
        open={detailInfoDialogOpen}
        onOpenChange={setDetailInfoDialogOpen}
        file={file}
        pathHierarchy={pathHierarchy}
      />
    </ContextMenu>
  );
};
