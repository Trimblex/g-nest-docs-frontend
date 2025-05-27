"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, User, XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useAuth } from "@/providers/auth-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

const formSchema = z.object({
  account: z
    .string()
    .min(1, "请输入用户名或邮箱")
    .refine((value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const usernameRegex = /^[a-zA-Z0-9_-]{4,16}$/;
      return emailRegex.test(value) || usernameRegex.test(value);
    }, "用户名或邮箱格式不正确"),
  password: z.string().min(1, "请输入密码"),
  remember: z.boolean().optional(),
});

interface LoginProps {
  logo?: string;
  title?: string;
  subtitle?: string;
  registerHref?: string;
  forgotPasswordHref?: string;
  homeHref?: string;
  toastContent?: string;
  redirectTo?: string;
}

export function Login({
  logo = "/logo.jpg",
  title = "欢迎登录银河云文档",
  subtitle = "开启您的智能文档管理之旅",
  registerHref = "/register",
  forgotPasswordHref = "/forgot-password",
  homeHref = "/",
  toastContent = "欢迎登录",
  //跳转
  redirectTo = "/desktop",
}: LoginProps = {}) {
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      account: "",
      password: "",
      remember: true,
    },
  });

  useEffect(() => {
    toast.success(toastContent);
    setIsClient(true);
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await login(values.account, values.password);
      setError(null);
      toast.success("登录成功");
      router.push(redirectTo);
    } catch (err) {
      setError("登录失败，请检查您的账号和密码");
      toast.error("登录失败，请检查您的账号和密码");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* 动态背景效果 */}
      {isClient && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-[400px] -top-[300px] w-[800px] h-[800px] opacity-20 animate-gradient-flow">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mix-blend-screen -rotate-45" />
          </div>

          <div className="absolute inset-0 opacity-30 animate-pulse">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full"
                style={{
                  width: `${((i % 10) * 0.3).toFixed(2)}px`,
                  height: `${((i % 10) * 0.3).toFixed(2)}px`,
                  top: `${((i % 10) * 10).toFixed(2)}%`,
                  left: `${((i % 10) * 10).toFixed(2)}%`,
                  animationDelay: `${(i % 10) * 0.5}s`,
                }}
              />
            ))}
          </div>

          <div className="absolute inset-0 opacity-10">
            <div className="absolute -inset-24 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 animate-rotate-scale rounded-full" />
            <div className="absolute -inset-32 bg-gradient-to-r from-purple-400/30 to-pink-400/30 animate-rotate-scale delay-1000 rounded-full" />
          </div>
        </div>
      )}

      <Card className="w-full max-w-md bg-gray-300/90 backdrop-blur-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 rounded-2xl shadow-xl">
        <CardHeader>
          <Button
            asChild
            variant="ghost"
            className="absolute left-4 top-4 text-gray-500 hover:text-blue-600"
          >
            <Link href={homeHref}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回首页
            </Link>
          </Button>

          <div className="text-center space-y-4 pt-8">
            <Image
              src={logo}
              alt="Logo"
              width={64}
              height={64}
              className="w-16 h-16 mx-auto rounded-full shadow-md border-2 border-white/50"
              loading="lazy"
            />
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <p className="text-gray-500 text-sm">{subtitle}</p>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <FormField
                control={form.control}
                name="account"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      用户名或邮箱
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          {...field}
                          placeholder="username@example.com"
                          className="pl-8 placeholder-gray-400 focus-visible:ring-blue-500"
                        />
                        {field.value && (
                          <XCircle
                            className="absolute right-3 top-3 h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-500"
                            onClick={() => form.setValue("account", "")}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">密码</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          {...field}
                          type="password"
                          placeholder="••••••••"
                          className="pl-8 placeholder-gray-400 focus-visible:ring-blue-500"
                        />
                        {field.value && (
                          <XCircle
                            className="absolute right-3 top-3 h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-500"
                            onClick={() => form.setValue("password", "")}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="remember"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-gray-400 data-[state=checked]:bg-blue-500"
                        />
                      </FormControl>
                      <FormLabel className="text-gray-600 !mt-0">
                        自动登录
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <Button
                  variant="link"
                  asChild
                  className="text-blue-600 hover:text-blue-700 px-0"
                >
                  <Link href={forgotPasswordHref}>忘记密码?</Link>
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                立即登录
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-gray-500 text-sm">
            还没有账号？
            <Button
              variant="link"
              asChild
              className="text-blue-600 hover:text-blue-700 px-1"
            >
              <Link href={registerHref}>立即注册</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
