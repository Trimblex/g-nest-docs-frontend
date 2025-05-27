"use client";

import { FullScreenLoader } from "@/components/fullscreen-loader";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const TermsPage = () => {
  return (
    <Suspense fallback={<FullScreenLoader label="加载中..." />}>
      <MainContent />
    </Suspense>
  );
};
const MainContent = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <Button variant="link" className="pl-0 mb-6" asChild>
            <Link href="/register" className="flex items-center gap-1">
              <ChevronLeftIcon className="h-4 w-4" />
              返回注册
            </Link>
          </Button>

          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-4">银河云文档用户服务协议</h2>
            <p className="text-muted-foreground mb-0">
              最后更新日期：2023年10月1日
            </p>
          </div>

          <div className="px-4 sm:px-8 space-y-6">
            {/* 协议生效 */}
            <section>
              <h3 className="text-xl font-semibold mb-2">一、接受条款</h3>
              <p className="text-gray-600">
                {`1.1
                  您在使用银河云文档（以下简称"本服务"）时，即表示您已充分阅读、理解并同意接受本协议的全部内容。`}
              </p>
            </section>

            {/* 服务内容 */}
            <section>
              <h3 className="text-xl font-semibold mb-2">二、服务描述</h3>
              <p className="text-gray-600">
                {`2.1
                  我们提供在线文档编辑、团队协作、云存储等功能，具体功能可能根据产品迭代调整。`}
              </p>
            </section>

            {/* 用户账户 */}
            <section>
              <h3 className="text-xl font-semibold mb-2">三、账户管理</h3>
              <p className="text-gray-600">
                3.1 您需提供真实有效的注册信息，并负责保管账户安全
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-600">
                <li>不得转让或出借账户</li>
                <li>发现非法使用应立即通知我们</li>
              </ul>
            </section>

            {/* 用户行为规范 */}
            <section>
              <h3 className="text-xl font-semibold mb-2">四、使用规则</h3>
              <p className="text-gray-600">4.1 禁止行为包括但不限于：</p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-600">
                <li>上传违法或侵权内容</li>
                <li>进行任何破坏服务稳定性的行为</li>
                <li>利用技术手段干扰系统</li>
              </ul>
            </section>

            {/* 隐私条款 */}
            <section>
              <h3 className="text-xl font-semibold mb-2">五、隐私保护</h3>
              <p className="text-gray-600">
                5.1 我们遵循《隐私政策》处理个人信息，您可通过
                <Link
                  href="/privacy"
                  className="mx-1 text-primary hover:underline"
                >
                  隐私政策页面
                </Link>
                了解详细信息
              </p>
            </section>

            {/* 免责声明 */}
            <section>
              <h3 className="text-xl font-semibold mb-2">六、免责条款</h3>
              <p className="text-gray-600">
                6.1 因以下情况导致的服务不可用，我们不承担责任：
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-600">
                <li>不可抗力（如自然灾害、网络服务中断）</li>
                <li>用户操作失误导致的文档丢失</li>
                <li>第三方服务（如支付系统）的故障</li>
              </ul>
            </section>

            {/* 协议变更 */}
            <section>
              <h3 className="text-xl font-semibold mb-2">七、协议修改</h3>
              <p className="text-gray-600">
                7.1 我们保留修改本协议的权利，重大变更将通过以下方式通知：
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-600">
                <li>网站公告</li>
                <li>注册邮箱通知</li>
                <li>客户端推送消息</li>
              </ul>
            </section>

            <div className="mt-8 p-4 bg-gray-50 rounded">
              <p className="text-sm text-muted-foreground">
                提示：本协议摘要仅为方便阅读，具体权利义务以完整版协议为准。
                如有疑问请联系：
                <a
                  href="mailto:legal@galaxydocs.com"
                  className="text-primary hover:underline"
                >
                  legal@galaxydocs.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
