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
import { GNestResponse } from "@/interface/common";
import { AxiosError } from "axios";

interface RenameDialogProps {
  document: DocumentInfoVO;
  initialTitle: string;
  setInitialTitle?: React.Dispatch<React.SetStateAction<string>>;
  children: React.ReactNode;
  loadData?: () => void;
}

export const RenameDialog = ({
  document,
  initialTitle,
  setInitialTitle,
  children,
  loadData,
}: RenameDialogProps) => {
  const [isRenaming, setIsRenaming] = useState(false);

  const [title, setTitle] = useState(initialTitle);
  const [open, setOpen] = useState(false);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsRenaming(true);
    axios
      .put(`/documents/${document.id}`, { title: title.trim() || "未命名" })
      .then(() => {
        document.title = title.trim() || "未命名";
        toast.success("重命名成功");
      })
      .catch((err: AxiosError<GNestResponse<null>, any>) => {
        toast.error(err.response?.data.message);
      })
      .finally(() => {
        setIsRenaming(false);
        setOpen(false);
        loadData && loadData();
        setInitialTitle && setInitialTitle(title.trim() || "未命名");
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
