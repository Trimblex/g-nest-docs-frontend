"use client";

import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Loader2, UploadCloud, Building2 } from "lucide-react";
import axios from "@/config/axiosConfig";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { OrgInfoVO } from "@/interface/orgs";
import { cn } from "@/lib/utils";

export const OrgSettingsForm = ({
  org,
  refreshOrgs,
  curUserRole,
}: {
  org: OrgInfoVO;
  refreshOrgs: () => Promise<void>;
  curUserRole: string;
}) => {
  const { register, handleSubmit, setValue, watch } = useForm<OrgInfoVO>();
  const [isUploading, setIsUploading] = useState(false);
  const logoUrl = watch("logoUrl");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragRejectReason, setDragRejectReason] = useState<string | null>(null);

  useEffect(() => {
    if (org) {
      setValue("name", org.name);
      setValue("slug", org.slug);
      setValue("description", org.description);
      setValue("logoUrl", org.logoUrl);
    }
  }, [org, setValue]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const validateFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      return { valid: false, error: "请选择图片文件" };
    }
    if (file.size > 2 * 1024 * 1024) {
      return { valid: false, error: "文件大小不能超过2MB" };
    }
    return { valid: true };
  };

  // 完善拖放处理
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length === 0) return;
    // 处理多文件情况
    if (files.length > 1) {
      toast.error("一次只能上传一个文件");
      return;
    }
    const file = files[0];
    const validation = validateFile(file);

    if (!validation.valid) {
      setDragRejectReason(validation.error!);
      setTimeout(() => setDragRejectReason(null), 2000);
      return;
    }
    handleFileUpload(file);
  };

  const handleFileUpload = async (file: File) => {
    if (curUserRole === "MEMBER") {
      toast.error("您不是管理员，无法上传文件", {
        description: "请先升级为管理员",
      });
    }
    const validation = validateFile(file);
    if (!validation.valid) {
      toast.error(validation.error!);
      return;
    }

    try {
      setIsUploading(true);

      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/files/uploadCommon", formData);

      setValue("logoUrl", res.data);
      toast.success("头像上传成功", { description: "新LOGO已更新" });
    } catch (error: Error | any) {
      toast.error("上传失败");
      console.log(error.message);
    } finally {
      setIsUploading(false);

      setPreviewUrl(null);
    }
  };

  const onSubmit = async (data: OrgInfoVO) => {
    try {
      await axios.patch(`/org/save`, data);
      await refreshOrgs();
      toast.success("设置已保存", {
        description: "组织信息更新成功",
        position: "top-center",
      });
    } catch (error) {
      toast.error("保存失败", {
        description: "请检查输入内容或网络连接",
      });
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Logo上传卡片 */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            组织标识
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* 头像上传区域 */}
            <div className="flex flex-col items-center gap-3 w-full md:w-auto">
              <div className="relative group">
                <Avatar className="h-18 w-18 border-2 shadow-md">
                  <AvatarImage src={logoUrl} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-r from-blue-100 to-purple-100 text-lg font-medium">
                    {org.name?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="logoUpload"
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-full transition-opacity cursor-pointer flex items-center justify-center"
                >
                  {isUploading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-white/90" />
                  ) : (
                    <UploadCloud className="h-8 w-8 text-white/90 transition-transform hover:scale-105" />
                  )}
                </label>
                <input
                  id="logoUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={isUploading || curUserRole === "MEMBER"}
                  onChange={(e) =>
                    e.target.files?.[0] && handleFileUpload(e.target.files[0])
                  }
                />
              </div>
              <p className="text-sm text-muted-foreground text-center md:text-left">
                支持 JPG, PNG 格式
                <br />
                建议尺寸 512×512px
              </p>
            </div>

            {/* 拖拽上传区域 */}
            <div className="flex-1 w-full">
              <div
                className={cn(
                  "border-2 border-dashed rounded-xl p-3 transition-colors",
                  "hover:border-primary hover:bg-accent/30 cursor-pointer",
                  "flex flex-col items-center justify-center gap-3 h-full",
                  "group/upload-area relative",
                  isDragging && "border-primary bg-accent/30",
                  dragRejectReason && "border-destructive/80 bg-destructive/10",
                  isUploading && "opacity-50 pointer-events-none"
                )}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("logoUpload")?.click()}
                role="button"
                tabIndex={0}
              >
                <UploadCloud
                  className={cn(
                    "h-10 w-10 mb-2 text-muted-foreground transition-colors",
                    isDragging && "text-primary",
                    dragRejectReason && "text-destructive"
                  )}
                />
                <div className="text-center space-y-1">
                  {dragRejectReason ? (
                    <>
                      <p className="text-destructive font-medium text-sm">
                        {dragRejectReason}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        支持 JPG, PNG 格式
                      </p>
                    </>
                  ) : isUploading ? (
                    <div className="flex items-center gap-2 text-primary">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="font-medium">上传中...</span>
                    </div>
                  ) : (
                    <>
                      <p className="font-medium text-foreground">
                        拖拽文件或{" "}
                        <span className="text-primary underline">点击上传</span>
                      </p>
                      <p className="text-muted-foreground text-xs">
                        建议尺寸 512×512px，最大2MB
                      </p>
                    </>
                  )}
                </div>
                {/* 键盘无障碍提示 */}
                <span className="sr-only">
                  拖放图片文件到此区域，或使用键盘选择文件
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 基本信息卡片 */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            基本信息
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            id="id"
            type="hidden"
            {...register("id")}
            readOnly
            value={org.id}
          />
          {/* 组织名称 - 调整为3列布局保持对齐 */}
          <div className="grid gap-y-2 gap-x-4 md:grid-cols-[180px_1fr] items-start">
            <label className="text-sm text-muted-foreground pt-2.5 md:text-right">
              组织名称
            </label>
            <div className="md:col-span-1 w-full">
              <Input
                disabled={curUserRole === "MEMBER"}
                {...register("name")}
                className="h-11 focus-visible:ring-primary/50"
              />
            </div>
          </div>

          {/* URL简称 - 优化网格比例和输入框对齐 */}
          <div className="grid gap-y-2 gap-x-4 md:grid-cols-[180px_1fr] items-start">
            <div className="space-y-1 md:text-right">
              <label className="text-sm font-medium" htmlFor="slug">
                URL 简称
              </label>
              <p className="text-muted-foreground text-sm font-normal md:mt-1">
                示例: your-company
              </p>
            </div>
            <div className="relative w-full">
              <Input
                disabled={curUserRole === "MEMBER"}
                id="slug"
                {...register("slug", {
                  pattern: {
                    value: /^[a-z0-9-]+$/,
                    message: "只允许小写字母、数字和连字符",
                  },
                })}
                className="h-11 focus-visible:ring-primary/50"
              />
            </div>
          </div>

          {/* 组织描述 - 对齐标签位置 */}
          <div className="grid gap-y-2 gap-x-4 md:grid-cols-[180px_1fr] items-start">
            <label
              className="text-sm font-medium pt-2.5 md:text-right"
              htmlFor="description"
            >
              组织描述
            </label>
            <Input
              disabled={curUserRole === "MEMBER"}
              id="description"
              {...register("description")}
              className="h-11 placeholder:text-muted-foreground/60 focus-visible:ring-primary/50"
              placeholder="用简短的话介绍你们的组织"
            />
          </div>
        </CardContent>
      </Card>

      <div className="sticky bottom-0 bg-background border-t py-4">
        <Button
          type="submit"
          size="lg"
          className="w-full md:w-auto gap-2 shadow-lg"
          disabled={isUploading}
        >
          {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
          保存所有更改
        </Button>
      </div>
    </form>
  );
};
