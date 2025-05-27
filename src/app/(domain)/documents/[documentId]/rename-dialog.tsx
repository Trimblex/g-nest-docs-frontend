"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import { useState } from "react";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { toast } from "sonner";
import axios from "@/config/axiosConfig";

interface RenameDialogProps {
  documentId: string;
  initialTitle: string;
  children: React.ReactNode;
}

export const RenameDialog = ({
  documentId,
  initialTitle,
  children,
}: RenameDialogProps) => {
  const [isRenaming, setIsRenaming] = useState(false);

  const [title, setTitle] = useState(initialTitle);
  const [open, setOpen] = useState(false);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault;
    setIsRenaming(true);
    axios
      .post(`/documents/${documentId}`, { title: title.trim() || "未命名" })
      .catch(() => toast.error("似乎出错了"))
      .then(() => toast.success("重命名成功"))
      .finally(() => {
        setIsRenaming(false);
        setOpen(false);
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent onClick={(event) => event.stopPropagation()}>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>重命名文档</DialogTitle>
            <DialogDescription>输入一个新名称</DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="新名称"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              disabled={isRenaming}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={isRenaming}
              onClick={(e) => e.stopPropagation()}
            >
              保存
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
