"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "./bread-crumbs";
import axios from "@/config/axiosConfig";
import { Skeleton } from "@/components/ui/skeleton";
import { FileInfoVO } from "@/interface/files";
import { FaFolder } from "react-icons/fa";

export const MoveDialog = ({
  open,
  onOpenChange,
  currentFileIds,
  parentId,
  pathHierarchy,
  onMove,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFileIds: string[];
  parentId: string;
  pathHierarchy: Array<{ id: string; name: string }>;
  onMove: (ids: string[], targetId: string) => void;
}) => {
  const [targetParentId, setTargetParentId] = useState(parentId);
  const [folders, setFolders] = useState<FileInfoVO[]>([]);
  const [loading, setLoading] = useState(false);
  const [curPathHierarchy, setCurPathHierarchy] =
    useState<Array<{ id: string; name: string }>>(pathHierarchy);

  useEffect(() => {
    if (open) {
      setTargetParentId(parentId);
      setCurPathHierarchy(pathHierarchy);
      setFolders([]);
    }
  }, [open, parentId, pathHierarchy]);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        setLoading(true);
        const res = await axios.post(`/files/all`, {
          fileId: targetParentId,
          excludeIds: currentFileIds,
        });
        const filteredFolders = res.data.filter(
          (file: FileInfoVO) => file.type === "FOLDER"
        );
        setFolders(filteredFolders);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchFolders();
    }
  }, [targetParentId, open]);

  const handleBreadcrumbClick = async (id: string) => {
    setTargetParentId(id);
    const res = await axios.post(`/files/path`, {
      fileId: id,
      excludeIds: currentFileIds,
    });
    setCurPathHierarchy(res.data);
    const { data } = await axios.post(`/files/all`, {
      fileId: id,
      excludeIds: currentFileIds,
    });
    setFolders(data.filter((file: FileInfoVO) => file.type === "FOLDER"));
  };

  const handleFolderClick = async (folderId: string) => {
    setTargetParentId(folderId);
    const res = await axios.post(`/files/path`, {
      fileId: folderId,
    });
    setCurPathHierarchy(res.data);
  };

  const handleDialogOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setTargetParentId(parentId);
      setCurPathHierarchy(pathHierarchy);
      setFolders([]);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>选择目标文件夹</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Breadcrumbs
            pathHierarchy={curPathHierarchy}
            onClick={handleBreadcrumbClick}
          />

          <div className="border rounded-lg p-4 h-64 overflow-auto">
            {loading
              ? Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full mb-2" />
                  ))
              : folders.map((folder) => (
                  <div
                    key={folder.id}
                    className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer transition-colors"
                    onClick={() => handleFolderClick(folder.id)}
                  >
                    <FaFolder className="h-5 w-5 text-blue-500" />
                    <span>{folder.name}</span>
                  </div>
                ))}
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              当前路径:
              {curPathHierarchy.length === 0 && "/"}
              {curPathHierarchy.map((segment) => (
                <span key={segment.id} className="flex-row items-center">
                  <span className="mx-1">/</span>
                  {segment.name}
                </span>
              ))}
            </div>
            <Button onClick={() => onMove(currentFileIds, targetParentId)}>
              移动到这里
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
