"use client";

import { Suspense } from "react";
import { Register } from "@/components/register";
import { useSearchParams } from "next/navigation";
import { FullScreenLoader } from "@/components/fullscreen-loader";

// 将使用 useSearchParams 的逻辑封装到子组件
const RegisterWithParams = () => {
  const param = useSearchParams();
  const redirectUrl = param.get("redirect");
  return <Register redirectTo={redirectUrl ?? "/desktop"} />;
};

const RegisterPage = () => {
  return (
    <Suspense fallback={<FullScreenLoader label="注册中..." />}>
      <RegisterWithParams />
    </Suspense>
  );
};
export default RegisterPage;
