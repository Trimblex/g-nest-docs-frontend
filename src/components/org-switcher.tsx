"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrg } from "@/providers/org-context";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import axios from "@/config/axiosConfig";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { OrgInfoVO } from "@/interface/orgs";
import { OrgManagementDialog } from "./org-management-dialog";
import { Loader2, PlusIcon, SettingsIcon } from "lucide-react";
import { toast } from "sonner";

export const OrgSwitcher = () => {
  const { currentOrg, organizations, isLoading, switchOrg, refreshOrgs } =
    useOrg();
  const [managedOrg, setManagedOrg] = useState<OrgInfoVO | null>(null);
  const handleManageOrg = (orgId: string) => {
    const org = organizations.find((o) => o.id === orgId);
    if (org) setManagedOrg(org);
  };

  if (isLoading) {
    return <Skeleton className="h-9 w-[120px] rounded-md" />;
  }

  const CreateOrgForm = () => {
    const {
      register,
      handleSubmit,
      formState: { errors },
      setValue,
    } = useForm<OrgInfoVO>();
    const [isUploading, setIsUploading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [step, setStep] = useState<"create" | "invite">("create");
    const [newOrgId, setNewOrgId] = useState<string | null>(null);
    const { refreshOrgs, switchOrg } = useOrg();

    const InviteMembersForm = ({ orgId }: { orgId: string }) => {
      const [emails, setEmails] = useState("");
      const [role, setRole] = useState<"ADMIN" | "MEMBER" | "OWNER">("MEMBER");
      const [isSending, setIsSending] = useState(false);
      const handleSendInvites = async () => {
        await refreshOrgs();
        await switchOrg(orgId);
        if (!emails) {
          alert("请输入至少一个邮箱地址");
          return;
        }
        const emailList = emails.split(/[,\s]+/).filter(Boolean);

        try {
          setIsSending(true);
          await axios.post("/org/invite", {
            orgId,
            emails: emailList,
            role,
          });
          setDialogOpen(false);
        } catch (error: Error | any) {
          toast.error("发送邀请失败");
          toast.error(error.message);
        } finally {
          setIsSending(false);
        }
      };
      return (
        <DialogContent className="w-[480px] rounded-lg space-y-4">
          <DialogTitle className="text-lg font-semibold">邀请成员</DialogTitle>

          <div className="space-y-6">
            {/* 邮箱输入区域 */}
            <div>
              <Label htmlFor="emails" className="block mb-2 font-medium">
                成员邮箱
              </Label>
              <textarea
                id="emails"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                placeholder="请输入一个或多个邮箱地址，用逗号或空格分隔"
                className="w-full p-3 border rounded-md h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 resize-none"
              />
            </div>
            {/* 角色选择区域 */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="role" className="block mb-2 font-medium">
                  分配角色
                </Label>
                <select
                  value={role}
                  onChange={(e: any) =>
                    setRole(e.target.value as "ADMIN" | "MEMBER" | "OWNER")
                  }
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MEMBER">普通成员</option>
                  <option value="ADMIN">管理员</option>
                  <option value="OWNER">所有者</option>
                </select>
              </div>
            </div>
            {/* 操作按钮 */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={async () => {
                  await refreshOrgs();
                  await switchOrg(orgId);
                  setDialogOpen(false);
                }}
              >
                跳过
              </Button>
              <Button
                onClick={handleSendInvites}
                disabled={isSending || !emails}
                className="min-w-[100px]"
              >
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    发送中...
                  </>
                ) : (
                  "发送邀请"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      );
    };
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const handleFileUpload = async (file: File) => {
      try {
        setIsUploading(true);

        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        const formData = new FormData();
        formData.append("file", file);

        const res = await axios.post("/files/uploadCommon", formData);

        setValue("logoUrl", res.data);
      } catch (error) {
        toast.error("上传失败");
        console.log(error);
      } finally {
        setIsUploading(false);
      }
    };

    useEffect(() => {
      return () => {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
      };
    }, [previewUrl]);
    const onSubmit = async (formData: OrgInfoVO) => {
      try {
        const response = await axios.post("/org/create", {
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          logoUrl: formData.logoUrl || null,
        });

        setNewOrgId(response.data.id);
        setStep("invite"); // 切换到邀请步骤
      } catch (error) {
        toast.error("创建失败");
        console.error(error);
      }
    };
    return (
      <Dialog
        onOpenChange={async (open: any) => {
          if (!open) {
            setPreviewUrl(null);
            await refreshOrgs();
            setDialogOpen(false);
          }
        }}
      >
        <>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full h-9 font-medium text-gray-700 hover:bg-gray-50 justify-start mt-1"
            >
              <PlusIcon className="mr-2 h-4 w-4 text-green-600" />
              创建新组织
            </Button>
          </DialogTrigger>
          {step === "create" ? (
            <DialogContent className="w-[480px] rounded-lg space-y-4">
              <DialogTitle className="text-lg font-semibold">
                创建新组织
              </DialogTitle>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* 上传区域 */}
                <div className="space-y-2">
                  <Label className="text-gray-700">组织Logo</Label>
                  <div className="flex items-center gap-4">
                    {/* 预览区域保持不变 */}
                    <div className="relative">
                      <div className="w-16 h-16 rounded-md border bg-gray-50 flex items-center justify-center overflow-hidden">
                        {previewUrl ? (
                          <Image
                            width={64}
                            height={64}
                            src={previewUrl}
                            alt="预览"
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <span className="text-gray-400 text-sm">预览</span>
                        )}
                      </div>
                      {isUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        </div>
                      )}
                    </div>
                    {/* 上传按钮 */}
                    <div className="flex-1">
                      <label
                        htmlFor="logo"
                        className={cn(
                          "inline-block text-sm px-4 py-2 rounded-md border border-gray-300",
                          "hover:bg-gray-50 transition-colors cursor-pointer",
                          isUploading && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {previewUrl ? "更换图片" : "选择图片"}
                      </label>
                      <p className="mt-1 text-xs text-gray-500">
                        支持 JPG, PNG 格式，大小不超过5MB
                      </p>
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={isUploading}
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileUpload(e.target.files[0]);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 表单字段 */}
                <div className="space-y-4">
                  <div>
                    <Label className="block mb-2 font-medium">组织名称 *</Label>
                    <Input
                      {...register("name", { required: "必填字段" })}
                      placeholder="例如：创新团队"
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.name && (
                      <span className="text-sm text-red-600">
                        {errors.name.message as string}
                      </span>
                    )}
                  </div>

                  <div>
                    <Label className="block mb-2 font-medium">URL简称 *</Label>
                    <Input
                      {...register("slug", {
                        required: "必填字段",
                        pattern: {
                          value: /^[a-z0-9-]+$/,
                          message: "只允许小写字母、数字和连字符",
                        },
                      })}
                      placeholder="例如：innovation-team"
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.slug && (
                      <span className="text-sm text-red-600">
                        {errors.slug.message as string}
                      </span>
                    )}
                  </div>

                  <div>
                    <Label className="block mb-2 font-medium">组织描述</Label>
                    <Input
                      {...register("description")}
                      placeholder="简短描述组织目标"
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="submit"
                    className="min-w-[100px]"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        创建中...
                      </>
                    ) : (
                      "创建组织"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          ) : (
            newOrgId && <InviteMembersForm orgId={newOrgId} />
          )}
        </>
      </Dialog>
    );
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="max-w-[180px] justify-start truncate"
          >
            {/* 当前显示内容 */}
            {currentOrg?.logoUrl ? (
              <Image
                src={currentOrg.logoUrl}
                alt={currentOrg.name}
                width={20}
                height={20}
                className="mr-2 rounded-sm"
              />
            ) : (
              <span className="mr-2">🏠</span>
            )}
            <span className="truncate">{currentOrg?.name || "个人空间"}</span>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[240px] p-1" align="start">
          <div className="space-y-1">
            {/* 个人空间选项 */}
            <div className="flex items-center justify-between w-full group">
              <Button
                variant="ghost"
                className="flex-1 justify-start h-10 truncate font-normal"
                onClick={() => switchOrg(null)}
              >
                <span className="mr-2">🏠</span>
                个人空间
              </Button>
              {/* 当前状态指示器 */}
              {(currentOrg === null || currentOrg.id === null) && (
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              )}
            </div>

            {/* 组织列表 */}
            {organizations.map((org) => (
              <div
                key={org.id}
                className="flex items-center justify-between w-full group hover:bg-accent rounded-sm"
              >
                <Button
                  variant="ghost"
                  className="..."
                  onClick={() => switchOrg(org.id)}
                >
                  {org.logoUrl ? (
                    <Image
                      src={org.logoUrl}
                      alt={org.name}
                      width={18}
                      height={18}
                      className="mr-2 rounded-sm"
                    />
                  ) : (
                    <span className="mr-2">🏢</span>
                  )}
                  <span className="truncate">{org.name}</span>
                </Button>

                {/* 右侧管理按钮 */}
                <div className="flex items-center">
                  {currentOrg?.id === org.id && (
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "opacity-0 group-hover:opacity-100",
                      "transition-opacity px-2"
                    )}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      handleManageOrg(org.id);
                    }}
                  >
                    <SettingsIcon />
                  </Button>
                </div>
              </div>
            ))}
            <CreateOrgForm />
          </div>
        </PopoverContent>
      </Popover>
      {managedOrg && (
        <OrgManagementDialog
          org={managedOrg}
          open={managedOrg !== null}
          onOpenChange={(open) => !open && setManagedOrg(null)}
          refreshOrgs={refreshOrgs}
        />
      )}
    </>
  );
};
