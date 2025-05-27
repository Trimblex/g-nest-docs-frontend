import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { FileInfoVO } from "@/interface/files";
import { MoveIcon, PencilIcon, ShareIcon, TrashIcon } from "lucide-react";

type MenuContentProps = {
  file: FileInfoVO;
  isContextMenu: boolean;
  position?: { x: number; y: number };
  onRename: () => void;
  onDelete: () => void;
  onShare: () => void;
  onMove: () => void;
  onDetail: () => void;
};

export const MenuContent = ({
  // file,
  isContextMenu,
  position,
  onRename,
  onDelete,
  onShare,
  onMove,
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
      <DropdownMenuItem onClick={onDetail} className="gap-2">
        <ShareIcon className="w-4 h-4" />
        <span>查看详细信息</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={onShare} className="gap-2">
        <ShareIcon className="w-4 h-4" />
        <span>分享</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={onRename} className="gap-2">
        <PencilIcon className="w-4 h-4" />
        <span>重命名</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={onMove} className="gap-2">
        <MoveIcon className="w-4 h-4" />
        <span>移动</span>
      </DropdownMenuItem>

      <DropdownMenuItem onClick={onDelete} className="gap-2 text-destructive">
        <TrashIcon className="w-4 h-4" />
        <span>删除</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};
