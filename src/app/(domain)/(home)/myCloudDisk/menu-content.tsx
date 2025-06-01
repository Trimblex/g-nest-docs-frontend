import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { FileInfoVO } from "@/interface/files";
import {
  Download,
  DownloadIcon,
  InfoIcon,
  MoveIcon,
  PencilIcon,
  ShareIcon,
  TrashIcon,
} from "lucide-react";

type MenuContentProps = {
  file: FileInfoVO;
  isContextMenu: boolean;
  position?: { x: number; y: number };
  onRename: () => void;
  onDelete: () => void;
  onShare: () => void;
  onMove: () => void;
  onDownload: (fileIds: string[]) => void;
  onDetail: () => void;
};

export const MenuContent = ({
  file,
  isContextMenu,
  position,
  onRename,
  onDelete,
  onShare,
  onMove,
  onDownload,
  onDetail,
}: MenuContentProps) => {
  return (
    <DropdownMenuContent
      align={isContextMenu ? "start" : "end"}
      style={
        isContextMenu
          ? {
              position: "fixed",
              left: position?.x,
              top: position?.y,
              minWidth: "160px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            }
          : {}
      }
      className="rounded-lg"
    >
      <DropdownMenuItem onClick={() => onDownload([file.id])} className="gap-2">
        <DownloadIcon className="w-4 h-4" />
        <span>下载</span>
      </DropdownMenuItem>

      <DropdownMenuItem onClick={onShare} className="gap-2">
        <ShareIcon className="w-4 h-4" />
        <span>分享</span>
      </DropdownMenuItem>
      <Separator />

      <DropdownMenuItem onClick={onRename} className="gap-2">
        <PencilIcon className="w-4 h-4" />
        <span>重命名</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={onMove} className="gap-2">
        <MoveIcon className="w-4 h-4" />
        <span>移动</span>
      </DropdownMenuItem>
      <Separator />
      <DropdownMenuItem onClick={onDetail} className="gap-2">
        <InfoIcon className="w-4 h-4" />
        <span>查看详细信息</span>
      </DropdownMenuItem>
      <Separator />

      <DropdownMenuItem onClick={onDelete} className="gap-2 text-destructive">
        <TrashIcon className="w-4 h-4" />
        <span>删除</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};
