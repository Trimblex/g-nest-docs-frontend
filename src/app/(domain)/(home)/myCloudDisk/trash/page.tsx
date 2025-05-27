"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "@/config/axiosConfig";
import { ArrowLeft, Trash2, Undo2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Breadcrumbs } from "../bread-crumbs";
import { format } from "date-fns/format";
import { FileInfoVO } from "@/interface/files";
export default function TrashPage() {
  const [deletedFiles, setDeletedFiles] = useState<FileInfoVO[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentFileId, setCurrentFileId] = useState<string>(
    searchParams.get("id") || "0"
  );
  const [pathHierarchy, setPathHierarchy] = useState<
    Array<{ id: string; name: string }>
  >([]);

  useEffect(() => {
    loadTrash();
  }, [currentFileId]);

  const handleFolderClick = (fileId: string, fileName: string) => {
    setCurrentFileId(fileId);
    setPathHierarchy((prev) => [...prev, { id: fileId, name: fileName }]);
  };

  const handleBreadcrumbClick = (id: string) => {
    if (id === "0") {
      setCurrentFileId("0");
      setPathHierarchy([]);
    } else {
      const index = pathHierarchy.findIndex((item) => item.id === id);
      if (index !== -1) {
        setCurrentFileId(id);
        setPathHierarchy((prev) => prev.slice(0, index + 1));
      }
    }
  };

  const loadTrash = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/files/recycle", {
        params: { fileId: currentFileId },
      });
      setDeletedFiles(res.data);
    } catch (error) {
      toast.error("加载回收站失败");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string, fileId: string) => {
    try {
      await axios.post("/files/recycle", { action, fileId });
      toast.success(action === "restore" ? "恢复成功" : "永久删除成功");
      loadTrash();
    } catch (error) {
      toast.error("操作失败，请重试");
      console.log(error);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/myCloudDisk")}
              className="hover:bg-accent/50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="font-medium">返回云盘</span>
            </Button>
            <h1 className="text-2xl font-bold text-foreground">回收站</h1>
          </div>
          <Breadcrumbs
            pathHierarchy={pathHierarchy}
            onClick={handleBreadcrumbClick}
            className="mt-1"
          />
        </div>
        <Button variant="outline" className="shrink-0" onClick={loadTrash}>
          刷新列表
        </Button>
      </div>
      <Card className="rounded-xl shadow-sm border-0">
        <Table className="[&_tr]:hover:bg-muted/10 [&_tr]:transition-colors">
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[35%] font-medium">文件名</TableHead>
              <TableHead className="w-[20%] font-medium">删除时间</TableHead>
              <TableHead className="text-right w-[10%] font-medium">
                操作
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <>
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-4 w-16 rounded-full" />
                          <Skeleton className="h-5 w-48" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-64" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-3 justify-end">
                          <Skeleton className="h-9 w-20 rounded-lg" />
                          <Skeleton className="h-9 w-20 rounded-lg" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </>
            ) : deletedFiles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-[400px] text-center">
                  <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground py-8">
                    <Trash2 className="h-16 w-16 opacity-60" />
                    <span className="text-lg font-medium">这里空空如也~</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              deletedFiles.map((file) => (
                <TableRow
                  key={file.id}
                  className={`transition-colors hover:bg-muted/30 ${
                    file.type === "FOLDER" ? "cursor-pointer" : ""
                  }`}
                  onClick={() =>
                    file.type === "FOLDER" &&
                    handleFolderClick(file.id, file.name)
                  }
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {file.type === "FOLDER" ? "文件夹" : "文件"}
                      </Badge>
                      <span className="font-medium">{file.name}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-sm">
                      {format(
                        new Date(file.deletedAt!),
                        "yyyy年MM月dd日 HH:mm"
                      )}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction("restore", file.id);
                        }}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Undo2 className="h-4 w-4 mr-1" />
                        恢复
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            删除
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>确认永久删除？</AlertDialogTitle>
                            <AlertDialogDescription>
                              即将永久删除 【{file.name}
                              】，该操作不可恢复。请确认您的操作。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive hover:bg-destructive/90"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction("delete", file.id);
                              }}
                            >
                              确认删除
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
      {!loading && deletedFiles.length > 0 && (
        <div className="p-4 bg-muted/30 rounded-lg flex items-center gap-3 border">
          <Trash2 className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            文件将在删除30天后自动永久清除
          </span>
        </div>
      )}
    </div>
  );
}
