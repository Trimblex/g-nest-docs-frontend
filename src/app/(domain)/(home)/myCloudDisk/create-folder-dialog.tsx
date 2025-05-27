"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

export const CreateFolderDialog = ({
  onCreate,
}: {
  onCreate: (name: string) => void;
}) => {
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);

  const handleCreate = () => {
    if (name.trim()) {
      onCreate(name);
      setName("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          新建文件夹
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[480px]">
        <DialogHeader>
          <DialogTitle>新建文件夹</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="输入文件夹名称"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button onClick={handleCreate}>创建</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
