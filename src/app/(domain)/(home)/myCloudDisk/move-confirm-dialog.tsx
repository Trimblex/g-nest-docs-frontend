import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoveIcon } from "lucide-react";
import type { MoveOperation } from "@/types/files";

type MoveConfirmDialogProps = {
  pendingMove: MoveOperation;
  targetName: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const MoveConfirmDialog = ({
  pendingMove,
  targetName,
  onConfirm,
  onCancel,
}: MoveConfirmDialogProps) => (
  <AlertDialog
    open={!!pendingMove}
    onOpenChange={(open) => !open && onCancel()}
  >
    <AlertDialogContent>
      <AlertDialogHeader>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-blue-500/20">
            <MoveIcon className="w-5 h-5 text-blue-500" />
          </div>
          <AlertDialogTitle>
            {pendingMove?.sourceIds.length && pendingMove?.sourceIds.length > 1
              ? "确认移动多个文件"
              : "确认移动文件"}
          </AlertDialogTitle>
        </div>
        <AlertDialogDescription className="text-muted-foreground">
          {pendingMove?.sourceIds.length && pendingMove?.sourceIds.length > 1
            ? `即将移动 ${pendingMove.sourceIds.length} 个文件`
            : `即将移动 ${pendingMove?.sourceName}`}{" "}
          到 <span className="font-medium text-foreground">{targetName}</span>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>取消</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm} className="bg-primary">
          确认移动
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
