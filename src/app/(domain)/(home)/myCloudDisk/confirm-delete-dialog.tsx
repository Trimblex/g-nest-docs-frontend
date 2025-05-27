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
import { TrashIcon } from "lucide-react";

type ConfirmDeleteDialogProps = {
  fileName: string;
  open: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
};

export const ConfirmDeleteDialog = ({
  fileName,
  open,
  onConfirm,
  onOpenChange,
}: ConfirmDeleteDialogProps) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-destructive/20">
            <TrashIcon className="w-5 h-5 text-destructive" />
          </div>
          <AlertDialogTitle>确认删除？</AlertDialogTitle>
        </div>
        <AlertDialogDescription>
          即将放入回收站 【{fileName}】。
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className="mt-4 gap-2">
        <AlertDialogCancel className="border-0">取消</AlertDialogCancel>
        <AlertDialogAction
          onClick={onConfirm}
          className="bg-destructive hover:bg-destructive/90"
        >
          确认删除
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
