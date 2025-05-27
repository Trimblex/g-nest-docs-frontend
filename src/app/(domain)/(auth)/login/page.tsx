"use client";

import { Suspense } from "react";
import { Login } from "@/components/login";
import { useSearchParams } from "next/navigation";
import { FullScreenLoader } from "@/components/fullscreen-loader";

// 将搜索参数逻辑分离到子组件
function LoginWithParams() {
  const param = useSearchParams();
  const redirectUrl = param.get("redirect");
  return <Login redirectTo={redirectUrl ?? "/desktop"} />;
}

const LoginPage = () => {
  return (
    <Suspense fallback={<FullScreenLoader label="登录中..." />}>
      <LoginWithParams />
    </Suspense>
  );
};

export default LoginPage;
