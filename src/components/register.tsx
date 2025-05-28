"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Mail,
  Lock,
  User,
  XCircle,
  CheckCircle2,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import axios from "../config/axiosConfig";
import { useAuth } from "@/providers/auth-context";
import { useRouter } from "next/navigation";
import Image from "next/image";

const formSchema = z.object({
  username: z
    .string()
    .min(3, "用户名至少3个字符")
    .max(20, "用户名最多20个字符")
    .regex(/^[a-zA-Z0-9_]+$/, "只能包含字母、数字和下划线"),
  email: z.string().email("邮箱格式不正确"),
  code: z.string().length(6, "验证码必须为6位数字"),
  password: z
    .string()
    .min(8, "密码至少8个字符")
    .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "必须包含字母和数字"),
  agreement: z.boolean().refine((val) => val, "必须同意用户协议"),
});

interface RegisterProps {
  logo?: string;
  title?: string;
  subtitle?: string;
  termsHref?: string;
  privacyHref?: string;
  loginHref?: string;
  homeHref?: string;
  onSuccess?: () => void;
  toastContent?: string;
  redirectTo?: string;
}

export function Register({
  logo = "/logo.jpg",
  title = "加入银河云文档",
  subtitle = "开启您的智能文档协作之旅",
  termsHref = "/terms",
  privacyHref = "/privacy",
  loginHref = "/login",
  //跳转
  redirectTo = "/desktop",
  onSuccess,
}: RegisterProps) {
  const [countdown, setCountdown] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      code: "",
      password: "",
      agreement: false,
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendCode = async () => {
    try {
      await form.trigger(["email", "username"]);
      const { email } = form.getValues();

      setCountdown(60);

      axios.post(
        "/auth/sendVerificationCode",
        {
          email,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      setSuccessMessage("验证码已发送至您的邮箱");
      setErrorMessage("");
    } catch (error: Error | any) {
      setErrorMessage(error.response?.data?.message || "验证码发送失败");
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/auth/register", values);
      await login(values.email, values.password);

      setSuccessMessage("注册成功，正在跳转...");
      onSuccess?.() || router.push(redirectTo);
    } catch (error: Error | any) {
      setErrorMessage(error.response?.data?.message || "注册失败");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* 动态背景 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-[400px] -top-[300px] w-[800px] h-[800px] opacity-25 animate-gradient-flow">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full mix-blend-screen -rotate-45" />
        </div>

        <div className="absolute inset-0 opacity-30 animate-particle-flow">
          {mounted &&
            [...Array(100)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full"
                style={{
                  width: `${Math.random() * 2}px`,
                  height: `${Math.random() * 2}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float ${Math.random() * 10 + 5}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
        </div>

        <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-3000" />
      </div>

      <Card className="w-full max-w-md bg-gray-300/90 backdrop-blur-lg rounded-2xl shadow-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 border-2 border-white/10 hover:shadow-3xl transition-shadow">
        <div className="absolute top-0 left-2 right-2 h-[2px] bg-transparent overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-purple-400/80 via-blue-400/80 to-pink-400/80 animate-progress-indicator origin-left rounded-full" />
        </div>

        <CardHeader>
          <div className="text-center relative -mt-4">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2">
              <div className="relative">
                <Image
                  src={logo}
                  alt="Logo"
                  width={80}
                  height={80}
                  className="mx-auto rounded-full shadow-xl border-4 border-white/50 hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 rounded-full border-2 border-purple-300/50 animate-glow-logo" />
              </div>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {title}
            </h2>
            <p className="text-muted-foreground text-sm mt-2">{subtitle}</p>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4 mb-6">
            {errorMessage && (
              <Alert
                variant="destructive"
                className="animate-notification-slide"
              >
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            {successMessage && (
              <Alert variant="default" className="animate-notification-slide">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>用户名</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          placeholder="3-20位字母、数字或下划线"
                          className="pl-8"
                        />
                        {mounted && field.value && (
                          <XCircle
                            className="absolute right-3 top-3 h-4 w-4 text-muted-foreground cursor-pointer"
                            onClick={() => form.setValue("username", "")}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>电子邮箱</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            placeholder="example@email.com"
                            className="pl-8"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="w-32">
                      <FormLabel>验证码</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            placeholder="6位数字"
                            maxLength={6}
                            className="pr-16"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleSendCode}
                            disabled={countdown > 0}
                            className="absolute right-1 top-1 h-8 px-2 text-xs"
                          >
                            {countdown > 0 ? `${countdown}s` : "获取"}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>设置密码</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="至少8位字母+数字"
                          className="pl-8 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-2 h-6 w-6"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeIcon className="h-4 w-4" />
                          ) : (
                            <EyeOffIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agreement"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        我已阅读并同意
                        <Link
                          href={termsHref}
                          className="text-primary hover:underline ml-1"
                        >
                          《用户服务协议》
                        </Link>
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
              >
                立即注册
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex-col justify-center mt-4">
          <div className="text-muted-foreground text-sm">
            注册即表示同意我们的
            <Link
              href={privacyHref}
              className="text-primary hover:underline ml-1"
            >
              隐私政策
            </Link>
          </div>
          <div className="text-sm text-gray-500">
            已有账号？
            <Link
              href={loginHref}
              className="text-blue-600 font-medium hover:underline hover:text-blue-700"
            >
              立即登录
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
