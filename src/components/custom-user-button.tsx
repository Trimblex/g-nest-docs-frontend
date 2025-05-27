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
  // 文件上传处理函数
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("avatar", file);
      const response = await axios.post("/users/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // 假设你的useAuth hook提供了更新用户信息的方法
      setUser({ ...user!, avatarUrl: response.data as string });
      toast.success("头像更新成功");
    } catch (error) {
      toast.error("头像上传失败");
      console.error("头像上传失败", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
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

    // 分割本地部分和域名
    const [local, domain] = email.split("@");

    // 至少保留前两个字符，其他用星号替换
    const maskedLocal = local.slice(0, 2) + "***" + local.slice(-2);

    return domain ? `${maskedLocal}@${domain}` : maskedLocal;
  };

  if (isLoading) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
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
      {/* 退出确认弹窗 */}
      <Dialog
        open={openStates.confirm}
        onOpenChange={(v) => toggleDialog("confirm", v)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认退出</DialogTitle>
            <DialogDescription>您确定要退出当前账号吗？</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => toggleDialog("confirm", false)}
            >
              取消
            </Button>
            <Button
              variant="destructive"
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
        <DialogContent className="max-w-2xl rounded-xl">
          <DialogHeader className="px-6 pt-4">
            <DialogTitle className="text-lg font-medium flex items-center gap-2 text-foreground">
              <Settings2Icon className="h-4 w-4 text-muted-foreground" />
              账户设置
            </DialogTitle>
          </DialogHeader>

          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="flex flex-row p-6 pt-2"
          >
            {/* 精简侧边导航 */}
            <TabsList className="flex flex-col h-auto w-32 space-y-1 bg-transparent p-0">
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
                  className="data-[state=active]:bg-accent/50 data-[state=active]:shadow-none 
                     justify-start px-3 py-2 h-9 rounded-md text-sm font-normal 
                     hover:bg-accent/30 transition-colors"
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* 内容区域优化 */}
            <div className="flex-1 ml-6 min-h-[400px]">
              <div className="h-full overflow-y-auto pl-6 border-l">
                {/* 个人资料 */}
                {selectedTab === "profile" && (
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
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
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                              <div className="animate-spin">🌀</div>
                            </div>
                          ) : user?.avatarUrl ? (
                            <>
                              <Image
                                src={user.avatarUrl}
                                alt="用户头像"
                                width={48}
                                height={48}
                                className="rounded-full object-cover border-2 group-hover:border-primary transition-all h-16 w-16"
                                priority
                              />
                              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="h-4 w-4 text-white" />
                              </div>
                            </>
                          ) : (
                            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                              <User className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 mt-2">
                        <h3 className="text-lg font-semibold">
                          {user?.username}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {user?.email}
                        </p>
                        <div className="flex gap-4 mt-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">注册时间</p>
                            <p>
                              {format(
                                new Date(user?.createdAt ?? Date.now()),
                                "yyyy年MM月dd日 HH:mm"
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">最后登录</p>
                            <p>
                              {format(
                                new Date(
                                  user?.lastLoginAt ??
                                    user?.createdAt ??
                                    Date.now()
                                ),
                                "yyyy年MM月dd日 HH:mm"
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
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="block mb-2">用户名</Label>
                        <Input
                          disabled={true}
                          defaultValue={user?.username}
                          className="max-w-xs"
                        />
                      </div>
                      <div>
                        <Label className="block mb-2">电子邮箱</Label>
                        <Input
                          disabled={true}
                          defaultValue={user?.email}
                          className="max-w-xs"
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium">界面主题</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {themeOptions.map((option) => (
                          <Button
                            key={option.value}
                            variant={
                              theme === option.value ? "secondary" : "outline"
                            }
                            className="h-12 justify-start gap-3 px-4 text-left"
                            onClick={() => setTheme(option.value)}
                          >
                            <span className="text-lg">{option.icon}</span>
                            <div>
                              <p>{option.label}</p>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 修改密码 */}
                {selectedTab === "password" && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="block mb-2">新密码</Label>
                        <Input
                          type="password"
                          name="newPassword"
                          autoComplete="new-password" // 标识新密码字段
                          className="max-w-xs"
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
                        <Label className="block mb-2">确认新密码</Label>
                        <Input
                          type="password"
                          name="confirmPassword"
                          autoComplete="new-password"
                          className="max-w-xs"
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }))
                          }
                        />
                      </div>
                      {/* 新增验证码输入 */}
                      <div>
                        <Label className="block mb-2">邮箱验证码</Label>
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
                            className="max-w-xs"
                            placeholder="输入6位验证码"
                          />
                          <Button
                            type="button"
                            onClick={handleSendVerificationCode}
                            disabled={isSending || countdown > 0}
                            variant="outline"
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
                    <Button className="px-8" onClick={handlePasswordUpdate}>
                      更新密码
                    </Button>
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
              <div className="relative flex items-center gap-2 cursor-pointer group">
                {user?.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt="用户头像"
                    width={32}
                    height={32}
                    className="rounded-full object-cover border-2 group-hover:border-primary transition-all"
                    priority
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{user?.username || "用户菜单"}</p>
            </TooltipContent>
          </Tooltip>
        </PopoverTrigger>

        <PopoverContent className="w-56 p-2" align="end">
          <div className="flex flex-col gap-1">
            <div className="px-2 py-1.5 space-y-1 border-b">
              <p className="text-sm font-medium truncate">{user?.username}</p>
              {user?.email && (
                <p className="text-xs text-muted-foreground truncate">
                  {obfuscateEmail(user.email)}
                </p>
              )}
            </div>

            <Button
              variant="ghost"
              className="justify-start h-8"
              onClick={() => toggleDialog("account", true)}
            >
              <Settings className="mr-2 h-4 w-4" />
              账户管理
            </Button>

            <Button
              variant="ghost"
              className="justify-start h-8 text-destructive hover:text-destructive"
              onClick={() => toggleDialog("confirm", true)}
            >
              <LogOut className="mr-2 h-4 w-4" />
              退出登录
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};
