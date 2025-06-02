"use client";
import { useCallback, useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";
import { FileNameDisplay } from "./file-name-display";
import { MenuContent } from "./menu-content";
import { ConfirmDeleteDialog } from "./confirm-delete-dialog";
import { MoveConfirmDialog } from "./move-confirm-dialog";
import { useDragAndDrop } from "@/hooks/use-drag-drop";
import { cn, formatDate, formatFileSize } from "@/lib/utils";
import { TableCell, TableRow } from "@/components/ui/table";
import { ShareDialog } from "./share-dialog";
import { MoveDialog } from "./move-dialog";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { FileInfoVO } from "@/interface/files";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DetailInfoDialog } from "./detail-info-dialog";
import { FileIcon } from "./file-icon";
import { FaFolder } from "react-icons/fa";
import Image from "next/image";

type FileRowProps = {
  file: FileInfoVO;
  pathHierarchy: Array<{ id: string; name: string }>;
  className?: string;
  onRename: (
    id: string,
    oldName: string,
    newName: string,
    type: "FILE" | "FOLDER"
  ) => void;
  onDelete: (ids: string[]) => void;
  onFolderClick: (fileId: string) => void;
  onMove: (ids: string[], parentId: string) => void;
  onDownload: (fileId: string[]) => void;
  isSelected: boolean;
  onClick: (fileId: string, e: React.MouseEvent) => void;
  selectedIds: string[];
};

export const FileRow = ({
  pathHierarchy,
  file,
  className,
  onRename,
  onDelete,
  onFolderClick,
  onMove,
  onDownload,
  isSelected,
  onClick,
  selectedIds,
}: FileRowProps) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailInfoDialogOpen, setDetailInfoDialogOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  useEffect(() => {
    setImageLoaded(false);
  }, [file.fileType]);
  const {
    isDragging,
    isOver,
    setRefs,
    pendingMove,
    handleConfirmMove,
    setPendingMove,
  } = useDragAndDrop(file, selectedIds, onMove, pathHierarchy);

  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    setMenuPosition({
      x: event.clientX,
      y: event.clientY,
    });
    setContextMenuOpen(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenuOpen) {
        setContextMenuOpen(false);
      }
    };
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

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      file.type === "FOLDER"
        ? onFolderClick(file.id)
        : window.open(
            `/filePreview/${encodeURIComponent(file.objectName!)}`,
            "_blank"
          );
    },
    [file, onFolderClick]
  );

  const renderFileIcon = () => {
    if (file.type === "FOLDER") {
      return <FaFolder className="w-6 h-6 text-blue-500" />;
    }
    const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(
      file.fileType?.toLowerCase() || ""
    );
    return (
      <div className="relative w-6 h-6">
        {isImage ? (
          <>
            <Image
              src={file.filePath ?? ""}
              alt={file.name}
              width={500}
              height={500}
              className={cn(
                "object-cover w-full h-full rounded-sm",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(false)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-background">
                <FileIcon
                  extension={file.fileType}
                  className="w-full h-full text-muted-foreground"
                />
              </div>
            )}
          </>
        ) : (
          <FileIcon
            extension={file.fileType}
            className="w-full h-full text-muted-foreground"
          />
        )}
      </div>
    );
  };
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <TableRow
          ref={setRefs}
          style={{
            backgroundColor: isSelected
              ? "hsl(210, 80%, 90%)"
              : isOver
              ? "hsl(var(--accent))"
              : undefined,
            opacity: isDragging ? 0.6 : 1,
          }}
          onContextMenu={handleContextMenu}
          onDoubleClick={handleDoubleClick}
          onClick={(e) => onClick(file.id, e)}
          className={cn(
            `${
              file.type === "FOLDER" ? "cursor-pointer" : ""
            } hover:bg-accent ${className}`,
            selectedIds.includes(file.id) &&
              selectedIds.length > 1 &&
              "bg-blue-50"
          )}
        >
          <TableCell className="font-medium max-w-[240px]">
            <div className="flex items-center gap-2">
              {renderFileIcon()}
              <FileNameDisplay
                file={file}
                isRenaming={isRenaming}
                onRename={handleRename}
              />
            </div>
          </TableCell>
          <TableCell>
            {file.type === "FOLDER" ? "文件夹" : file.fileType?.toUpperCase()}
          </TableCell>
          <TableCell>{formatFileSize(file.size ?? 0)}</TableCell>
          <TableCell>{formatDate(file.modifiedAt)}</TableCell>
          <TableCell className="text-right w-[60px]">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <MenuContent
                file={file}
                isContextMenu={false}
                onRename={() => setIsRenaming(true)}
                onDelete={() => setDeleteDialogOpen(true)}
                onShare={() => setShareDialogOpen(true)}
                onMove={() => setMoveDialogOpen(true)}
                onDownload={onDownload}
                onDetail={() => setDetailInfoDialogOpen(true)}
              />
            </DropdownMenu>

            {/* 右键菜单 */}
            <DropdownMenu
              open={contextMenuOpen}
              onOpenChange={setContextMenuOpen}
            >
              <MenuContent
                file={file}
                isContextMenu
                position={menuPosition}
                onRename={() => setIsRenaming(true)}
                onDelete={() => setDeleteDialogOpen(true)}
                onShare={() => setShareDialogOpen(true)}
                onMove={() => setMoveDialogOpen(true)}
                onDownload={onDownload}
                onDetail={() => setDetailInfoDialogOpen(true)}
              />
            </DropdownMenu>
          </TableCell>
        </TableRow>
      </ContextMenuTrigger>

      <MoveConfirmDialog
        pendingMove={pendingMove}
        targetName={file.name}
        onConfirm={handleConfirmMove}
        onCancel={() => pendingMove && (setPendingMove as any)(null)}
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
