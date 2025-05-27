"use client";
import { useState } from "react";
import { File, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export const UploadFileDialog = ({
  onUpload,
  isUploading,
  uploadProgress,
}: {
  onUpload: (files: File[]) => Promise<void>;
  isUploading: boolean;
  uploadProgress: number;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files && Array.from(e.target.files);
    if (selectedFiles) setFiles(selectedFiles);
  };
  const handleUploadConfirm = async () => {
    try {
      await onUpload(files);
      setFiles([]);
      setOpen(false);
    } catch (error: Error | any) {
      toast.error("上传出错");
      console.error("上传出错:", error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          上传文件
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>上传文件</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center 
              ${isDragging ? "border-blue-500 bg-blue-50" : "border-muted"}
              ${files.length > 0 ? "border-green-500 bg-green-50" : ""}
              transition-colors`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="space-y-1">
                <p className="font-medium">
                  {files.length > 0
                    ? `已选择 ${files.length} 个文件`
                    : "拖拽文件到这里或点击上传"}
                </p>
                <p className="text-sm text-muted-foreground">
                  支持单个或多个文件上传
                </p>
              </div>
              <label className="cursor-pointer mt-4">
                <span className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
                  <input
                    type="FILE"
                    className="hidden"
                    multiple
                    onChange={handleFileSelect}
                  />
                  选择文件
                </span>
              </label>
            </div>
          </div>
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2 p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div>
                      <File className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="font-medium">{file.name}</span>
                      <span className="text-muted-foreground ml-2">
                        ({(file.size / 1024 / 1024).toFixed(1)} MB)
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {isUploading &&
                    (uploadProgress === -1 ? (
                      <label>上传失败</label>
                    ) : (
                      <div className="mt-4">
                        <Progress value={uploadProgress} className="h-2" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          上传进度: {uploadProgress}%
                        </p>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setFiles([]);
                setOpen(false);
              }}
            >
              取消
            </Button>
            <Button
              onClick={handleUploadConfirm}
              disabled={files.length === 0 || isUploading}
            >
              {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isUploading ? "上传中..." : "开始上传"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
