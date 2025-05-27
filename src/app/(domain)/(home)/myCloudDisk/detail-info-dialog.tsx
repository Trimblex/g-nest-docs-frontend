"use client";
import { FileInfoVO } from "@/interface/files";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import {
  Folder,
  FileText,
  Clock,
  Calendar,
  FolderOpen,
  TypeIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { FileIcon } from "./file-icon";
import { FaFolder, FaFolderOpen } from "react-icons/fa";

export const DetailInfoDialog = ({
  open,
  onOpenChange,
  file,
  pathHierarchy,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: FileInfoVO;
  pathHierarchy: Array<{ id: string; name: string }>;
}) => {
  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(
    file.fileType?.toLowerCase() || ""
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-blue-500" />
            文件详细信息
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 缩略图预览 */}
          {file.type === "FOLDER" ? (
            <FaFolder className="w-14 h-14 text-blue-500/90" />
          ) : (
            <>
              {isImage && file.filePath ? (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={file.filePath}
                    alt={file.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ) : (
                <FileIcon
                  extension={file.fileType}
                  className="w-14 h-14 text-muted-foreground"
                />
              )}
            </>
          )}

          {/* 信息表格 */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <InfoItem
              icon={file.type === "FOLDER" ? Folder : FileText}
              label={file.type === "FOLDER" ? "文件夹名称" : "文件名称"}
              value={file.name}
            />

            <InfoItem
              icon={TypeIcon}
              label="类型"
              value={
                file.type === "FOLDER"
                  ? "文件夹"
                  : file.fileType?.toUpperCase() ?? ""
              }
            />

            {file.type === "FILE" && (
              <InfoItem
                icon={FaFolderOpen}
                label="存储位置"
                value={
                  file.parentId === "0"
                    ? "根目录"
                    : pathHierarchy[0].name || "-"
                }
              />
            )}

            <InfoItem
              icon={Clock}
              label="修改时间"
              value={formatDate(file.modifiedAt)}
            />

            <InfoItem
              icon={Calendar}
              label="创建时间"
              value={formatDate(file.createdAt)}
            />

            {file.type === "FILE" && (
              <InfoItem
                icon={FileText}
                label="文件大小"
                value={file.size || "-"}
              />
            )}
          </div>

          {/* 路径展示 */}
          <div className="rounded-lg border p-3 bg-muted/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FaFolderOpen className="h-4 w-4" />
              <span className="font-medium">存储路径：</span>
              <span className="truncate">
                {pathHierarchy?.map((p) => p.name).join("/") || "/"}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const InfoItem = ({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  className?: string;
}) => (
  <div className={cn("flex flex-col gap-1", className)}>
    <div className="flex items-center gap-1 text-muted-foreground">
      <Icon className="h-4 w-4" />
      <span className="text-xs">{label}</span>
    </div>
    <span className="font-medium truncate">{value || "-"}</span>
  </div>
);
