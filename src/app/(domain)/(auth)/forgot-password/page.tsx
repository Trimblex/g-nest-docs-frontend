"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Mail, Lock, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { toast } from "sonner";
import axios from "@/config/axiosConfig";
import Image from "next/image";
import { FullScreenLoader } from "@/components/fullscreen-loader";

const ForgotPasswordPage = () => {
  return (
    <Suspense fallback={<FullScreenLoader label="加载中..." />}>
      <MainContent />
    </Suspense>
  );
};
function MainContent() {
  const [countdown, setCountdown] = useState(0);
  const [showVerification, setShowVerification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm({
    defaultValues: {
      email: "",
      code: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendCode = async () => {
    try {
      const emailValid = await form.trigger("email");
      if (!emailValid) return;

      const email = form.getValues("email");
      setCountdown(60);
      axios.post(
        "/users/sendVerificationCode",
        {
          email: email,
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

      setShowVerification(true);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("请输入有效的邮箱地址");
      toast.error("验证码发送失败" + error);
    }
  };

  const onSubmit = async () => {
    if (!form.getValues("password")) toast.error("请输入新密码");
    if (form.getValues("password") !== form.getValues("confirmPassword")) {
      toast.error("新密码与确认密码不匹配");
    }
    if (!form.getValues("code")) toast.error("请输入验证码");
    try {
      await axios.put("/users/password", {
        newPassword: form.getValues("password"),
        emailCode: form.getValues("code"),
      });
      toast.success("密码重置成功");
    } catch (error: Error | any) {
      toast.error(error.message || "密码重置");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <Image
            src="/logo.jpg"
            height={36}
            width={36}
            alt="银河云文档"
            className="w-16 h-16 mx-auto mb-4 rounded-full"
          />
          <h2 className="text-2xl font-bold">重置密码</h2>
          <p className="text-muted-foreground">
            {showVerification
              ? "请输入验证码并设置新密码"
              : "请输入注册邮箱接收验证码"}
          </p>
        </CardHeader>

        <CardContent>
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* 邮箱输入 */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>注册邮箱</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          placeholder="example@email.com"
                          className="pl-8 pr-24"
                        />
                        <Button
                          type="button"
                          variant="link"
                          onClick={handleSendCode}
                          disabled={countdown > 0}
                          className="absolute right-2 top-1 h-8 px-2 text-sm"
                        >
                          {countdown > 0
                            ? `${countdown}秒后重发`
                            : "获取验证码"}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 验证码和新密码 */}
              {showVerification && (
                <>
                  <FormField
                    control={form.control}
                    name="code"
                    rules={{
                      required: "请输入6位验证码",
                      minLength: { value: 6, message: "验证码必须为6位数字" },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>短信验证码</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <ShieldAlert className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              {...field}
                              placeholder="123456"
                              maxLength={6}
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
                    name="password"
                    rules={{
                      required: "请输入新密码",
                      minLength: { value: 8, message: "密码至少8个字符" },
                      pattern: {
                        value: /^(?=.*[A-Za-z])(?=.*\d).+$/,
                        message: "必须包含字母和数字",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>新密码</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              {...field}
                              type="password"
                              placeholder="至少8位字母+数字"
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
                    name="confirmPassword"
                    rules={{
                      required: "请确认新密码",
                      validate: (value) =>
                        value === form.getValues("password") ||
                        "两次输入的密码不一致",
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>确认新密码</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              {...field}
                              type="password"
                              placeholder="再次输入密码"
                              className="pl-8"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full h-11">
                    重置密码
                  </Button>
                </>
              )}
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex justify-center mt-4">
          <Link href="/login" className="text-primary text-sm hover:underline">
            返回登录
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ForgotPasswordPage;
