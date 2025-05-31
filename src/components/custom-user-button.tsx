import { useRef, useState } from "react";
import { useAuth } from "@/providers/auth-context";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Settings,
  User,
  Lock,
  LogOut,
  Settings2Icon,
  Camera,
  Mail,
  X,
  Trash2,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import Link from "next/link";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { format } from "date-fns/format";
import { toast } from "sonner";
import axios from "@/config/axiosConfig";

export const CustomUserButton = () => {
  const { isAuthenticated, isLoading, logout, user, setUser } = useAuth();
  const { setTheme, theme } = useTheme();
  const [openStates, setOpenStates] = useState({
    confirm: false,
    account: false,
  });
  const [selectedTab, setSelectedTab] = useState("profile");

  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
    emailCode: "",
  });
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [formErrors] = useState<Record<string, string>>({});

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false); // 新增：删除头像确认对话框状态
  const [isDeleting, setIsDeleting] = useState(false); // 新增：删除加载状态

  const cropImageToCircle = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image(); // 修复：使用 new Image() 创建对象
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = Math.min(img.width, img.height);
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("无法获取画布上下文"));
          return;
        }

        // 创建圆形裁剪路径
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // 居中绘制图像
        ctx.drawImage(
          img,
          (img.width - size) / 2,
          (img.height - size) / 2,
          size,
          size,
          0,
          0,
          size,
          size
        );

        // 转换为Blob
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("画布转Blob失败"));
          }
        }, "image/png");
      };
      img.onerror = (error) => {
        URL.revokeObjectURL(img.src);
        reject(error);
      };
    });
  };
  // 文件上传处理函数
  const uploadAvatar = async (file: File | null) => {
    try {
      setIsUploading(true);
      // 创建FormData
      const formData = new FormData();

      if (file) {
        // 如果是上传文件，裁剪图像为圆形
        const croppedBlob = await cropImageToCircle(file);
        const fileName = `avatar_${Date.now()}.png`;
        formData.append(
          "avatar",
          new File([croppedBlob], fileName, { type: "image/png" })
        );
      } else {
        // 如果是删除头像，传递空值
        formData.append("avatar", "");
      }
      // 发送请求
      const response = await axios.post("/users/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // 更新用户头像
      setUser({ ...user!, avatarUrl: file ? response.data : null });
      toast.success(file ? "头像更新成功" : "头像已删除");
    } catch (error) {
      toast.error(file ? "头像上传失败" : "头像删除失败");
      console.error(file ? "头像上传失败" : "头像删除失败", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadAvatar(file);
    }
  };

  const handleDeleteAvatar = async () => {
    await uploadAvatar(null);
    setConfirmDeleteOpen(false);
  };

  // 发送验证码处理
  const handleSendVerificationCode = async () => {
    if (!user?.email) return;

    setIsSending(true);
    try {
      setCountdown(60);
      axios.post(
        "/users/sendVerificationCode",
        {
          email: user.email,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      toast.success("验证码已发送至注册邮箱");
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      setTimeout(() => clearInterval(timer), 60000);
    } catch (error) {
      toast.error("验证码发送失败");
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const handlePasswordUpdate = async () => {
    // 表单验证
    if (!passwordForm.newPassword) toast.error("请输入新密码");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("新密码与确认密码不匹配");
    }
    if (!passwordForm.emailCode) toast.error("请输入验证码");
    try {
      await axios.put("/users/password", {
        newPassword: passwordForm.newPassword,
        emailCode: passwordForm.emailCode,
      });
      toast.success("密码更新成功");
      setPasswordForm({
        newPassword: "",
        confirmPassword: "",
        emailCode: "",
      });
      logout();
    } catch (error: Error | any) {
      toast.error(error.message || "更新失败");
    }
  };

  const themeOptions = [
    { value: "light", label: "浅色主题", icon: "☀️" },
    { value: "dark", label: "深色主题", icon: "🌙" },
    { value: "system", label: "系统默认", icon: "💻" },
  ];

  const toggleDialog = (key: keyof typeof openStates, value: boolean) => {
    setOpenStates((prev) => ({ ...prev, [key]: value }));
  };

  const obfuscateEmail = (email: string) => {
    if (!email) return "";
    const [local, domain] = email.split("@");
    const maskedLocal = local.slice(0, 2) + "***" + local.slice(-2);
    return domain ? `${maskedLocal}@${domain}` : maskedLocal;
  };

  if (isLoading) {
    return <Skeleton className="h-9 w-0 rounded-full" />;
  }

  if (!isAuthenticated) {
    return (
      <Button asChild variant="ghost" className="gap-1">
        <Link href="/login">
          <Lock className="h-4 w-4" />
          登录
        </Link>
      </Button>
    );
  }

  return (
    <>
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="rounded-xl max-w-md">
          <DialogHeader className="pt-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle className="text-center text-lg font-medium">
              删除头像
            </DialogTitle>
            <DialogDescription className="text-center">
              确定要删除当前头像吗？删除后无法恢复
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-center">
            <Button
              variant="outline"
              className="rounded-full w-full sm:w-auto"
              onClick={() => setConfirmDeleteOpen(false)}
              disabled={isDeleting}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              className="rounded-full w-full sm:w-auto"
              onClick={handleDeleteAvatar}
              disabled={isDeleting}
            >
              {isDeleting ? "删除中..." : "确认删除"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* 退出确认弹窗 */}
      <Dialog
        open={openStates.confirm}
        onOpenChange={(v) => toggleDialog("confirm", v)}
      >
        <DialogContent className="rounded-xl max-w-md">
          <DialogHeader className="pt-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <LogOut className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle className="text-center text-lg font-medium">
              确认退出
            </DialogTitle>
            <DialogDescription className="text-center">
              您确定要退出当前账号吗？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-center">
            <Button
              variant="outline"
              className="rounded-full w-full sm:w-auto"
              onClick={() => toggleDialog("confirm", false)}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              className="rounded-full w-full sm:w-auto"
              onClick={() => {
                logout();
                toggleDialog("confirm", false);
              }}
            >
              确认退出
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* 统一账户管理弹窗 */}
      <Dialog
        open={openStates.account}
        onOpenChange={(v) => toggleDialog("account", v)}
      >
        <DialogContent className="max-w-3xl w-3xl rounded-xl overflow-hidden">
          <DialogHeader className="px-6 pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Settings2Icon className="h-5 w-5 text-primary" />
              <DialogTitle className="text-lg font-medium">
                账户设置
              </DialogTitle>
            </div>
          </DialogHeader>
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="flex flex-row"
          >
            {/* 侧边导航 */}
            <div className="bg-muted/40 border-r p-4">
              <TabsList className="flex flex-col h-auto w-36 space-y-1.5 bg-transparent p-0">
                {[
                  {
                    value: "profile",
                    icon: <User className="h-4 w-4" />,
                    label: "个人资料",
                  },
                  {
                    value: "settings",
                    icon: <Settings className="h-4 w-4" />,
                    label: "账号设置",
                  },
                  {
                    value: "password",
                    icon: <Lock className="h-4 w-4" />,
                    label: "安全设置",
                  },
                ].map((item) => (
                  <TabsTrigger
                    key={item.value}
                    value={item.value}
                    className={`group data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all
                      justify-start px-3 py-3 rounded-lg text-sm font-normal 
                      hover:bg-accent/30 w-full text-left`}
                  >
                    <span className="mr-2 text-foreground/80">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            {/* 内容区域优化 */}
            <div className="flex-1 min-h-[400px] max-h-[70vh] overflow-auto">
              <div className="py-4 px-8">
                {/* 个人资料 */}
                {selectedTab === "profile" && (
                  <div className="space-y-6">
                    <div className="flex items-start gap-6">
                      <div className="relative flex items-center gap-2 cursor-pointer group">
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileUpload}
                          disabled={isUploading}
                        />
                        <div
                          className="relative"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {isUploading ? (
                            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center border-2 border-dashed">
                              <div className="animate-spin">🌀</div>
                            </div>
                          ) : user?.avatarUrl ? (
                            <>
                              <Image
                                src={user.avatarUrl}
                                alt="用户头像"
                                width={96}
                                height={96}
                                className="rounded-full object-cover border-2 group-hover:border-primary transition-all h-24 w-24"
                                priority
                              />
                              <div className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-2">
                                <Camera className="h-5 w-5 text-white mb-1" />
                                <span className="text-xs text-white text-center">
                                  更换头像
                                </span>
                              </div>

                              {/* 新增：右上角删除按钮 */}
                              <button
                                className="absolute -top-1 -right-1 z-10 bg-destructive rounded-full p-1.5 shadow-md hover:bg-destructive/80 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation(); // 阻止触发上传事件
                                  setConfirmDeleteOpen(true);
                                }}
                                title="删除头像"
                              >
                                <X className="h-2 w-2 text-white" />
                              </button>
                            </>
                          ) : (
                            <div className="h-24 w-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                              {user?.username?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 mt-1">
                        <h3 className="text-xl font-semibold tracking-tight">
                          {user?.username}
                        </h3>
                        <div className="flex items-center mt-2 text-muted-foreground">
                          <Mail className="h-4 w-4 mr-2" />
                          <span>{user?.email}</span>
                        </div>
                        <div className="flex gap-8 mt-6 text-sm">
                          <div>
                            <p className="text-muted-foreground mb-1">
                              注册时间
                            </p>
                            <p className="font-medium">
                              {format(
                                new Date(user?.createdAt ?? Date.now()),
                                "yyyy年MM月dd日"
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">
                              最后登录
                            </p>
                            <p className="font-medium">
                              {format(
                                new Date(
                                  user?.lastLoginAt ??
                                    user?.createdAt ??
                                    Date.now()
                                ),
                                "yyyy年MM月dd日"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* 账号设置 */}
                {selectedTab === "settings" && (
                  <div className="space-y-8">
                    <div className="space-y-5">
                      <h4 className="font-medium text-base">个人信息</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="block mb-1.5">用户名</Label>
                          <Input
                            disabled={true}
                            defaultValue={user?.username}
                            className="rounded-lg"
                          />
                        </div>
                        <div>
                          <Label className="block mb-1.5">电子邮箱</Label>
                          <Input
                            disabled={true}
                            defaultValue={user?.email}
                            className="rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-5">
                      <h4 className="font-medium text-base">界面主题</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {themeOptions.map((option) => (
                          <Button
                            key={option.value}
                            variant={
                              theme === option.value ? "default" : "outline"
                            }
                            className={`h-16 justify-start gap-3 px-4 text-left rounded-lg
                              ${
                                theme === option.value ? "border-primary" : ""
                              }`}
                            onClick={() => setTheme(option.value)}
                          >
                            <span className="text-xl">{option.icon}</span>
                            <div>
                              <p className="font-medium">{option.label}</p>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {/* 修改密码 */}
                {selectedTab === "password" && (
                  <div className="space-y-8">
                    <div className="space-y-5">
                      <h4 className="font-medium text-base">密码修改</h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label className="block mb-1.5">新密码</Label>
                          <Input
                            type="password"
                            name="newPassword"
                            autoComplete="new-password"
                            className="rounded-lg"
                            value={passwordForm.newPassword}
                            onChange={(e) =>
                              setPasswordForm((prev) => ({
                                ...prev,
                                newPassword: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label className="block mb-1.5">确认新密码</Label>
                          <Input
                            type="password"
                            name="confirmPassword"
                            autoComplete="new-password"
                            className="rounded-lg"
                            value={passwordForm.confirmPassword}
                            onChange={(e) =>
                              setPasswordForm((prev) => ({
                                ...prev,
                                confirmPassword: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label className="block mb-1.5">邮箱验证码</Label>
                          <div className="flex gap-2">
                            <Input
                              type="text"
                              value={passwordForm.emailCode}
                              onChange={(e) =>
                                setPasswordForm((prev) => ({
                                  ...prev,
                                  emailCode: e.target.value,
                                }))
                              }
                              className="rounded-lg flex-1"
                              placeholder="输入6位验证码"
                            />
                            <Button
                              type="button"
                              onClick={handleSendVerificationCode}
                              disabled={isSending || countdown > 0}
                              variant="outline"
                              className={`rounded-lg min-w-[120px] transition-all ${
                                countdown > 0 ? "text-muted-foreground" : ""
                              }`}
                            >
                              {countdown > 0
                                ? `${countdown}秒后重发`
                                : "获取验证码"}
                            </Button>
                          </div>
                          {formErrors.emailCode && (
                            <p className="text-sm text-destructive mt-1">
                              {formErrors.emailCode}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        className="rounded-lg px-6 py-3 font-medium"
                        onClick={handlePasswordUpdate}
                      >
                        更新密码
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
      {/* 用户菜单触发按钮 */}
      <Popover>
        <PopoverTrigger>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative flex items-center gap-2 cursor-pointer">
                {user?.avatarUrl ? (
                  <div className="relative">
                    <Image
                      src={user.avatarUrl}
                      alt="用户头像"
                      width={40}
                      height={40}
                      className="rounded-full object-cover border-2 border-transparent hover:border-primary transition-all shadow-sm"
                      priority
                    />
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border border-white"></div>
                  </div>
                ) : (
                  <div className="h-9 w-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium shadow-md">
                    <span className="text-sm tracking-tighter">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="rounded-lg px-2 py-1 text-xs"
            >
              <p>{user?.username || "用户菜单"}</p>
            </TooltipContent>
          </Tooltip>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-1.5 rounded-xl shadow-lg" align="end">
          <div className="flex flex-col gap-0.5">
            <div className="px-3 py-3 space-y-1">
              <p className="text-sm font-medium tracking-tight truncate">
                {user?.username}
              </p>
              {user?.email && (
                <p className="text-xs text-muted-foreground truncate">
                  {obfuscateEmail(user.email)}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              className="justify-start h-9 rounded-lg gap-2 text-sm font-normal"
              onClick={() => toggleDialog("account", true)}
            >
              <Settings className="h-4 w-4" />
              账户管理
            </Button>
            <Button
              variant="ghost"
              className="justify-start h-9 rounded-lg gap-2 text-destructive hover:text-destructive text-sm font-normal"
              onClick={() => toggleDialog("confirm", true)}
            >
              <LogOut className="h-4 w-4" />
              退出登录
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};
