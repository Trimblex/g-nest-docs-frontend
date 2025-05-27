import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation 导航栏 */}
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.jpg"
              alt="Logo"
              className="h-8 w-8 rounded-lg"
              width={36}
              height={36}
            />
            <span className="text-xl font-bold text-blue-600">银河云文档</span>
          </div>
          <a
            href="/desktop"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            立即体验
          </a>
        </div>
      </nav>
      <div className="h-16"></div>

      {/* Hero Section 首屏展示 */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center mt-[76px]">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          智能云存储与协作新标杆
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          融合云端存储、智能文档编辑与团队协作的一体化平台，支持100+格式在线预览，AI辅助创作，多端实时同步，打造无缝工作流
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="/desktop"
            className="px-8 py-4 bg-blue-600 text-white rounded-xl text-lg hover:bg-blue-700 transition-colors"
          >
            立即免费使用
          </a>
          <a
            href="#features"
            className="px-8 py-4 bg-white text-blue-600 rounded-xl text-lg border border-blue-600 hover:bg-blue-50 transition-colors"
          >
            查看核心功能
          </a>
        </div>
      </section>

      {/* Features Grid 功能模块 */}
      <section id="features" className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">智能云存储</h3>
            <p className="text-gray-600">
              安全可靠的云端存储空间，支持文档、图片、视频等全类型文件管理，智能分类与全局搜索，多终端自动同步
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">AI智能创作</h3>
            <p className="text-gray-600">
              集成自然语言处理引擎，提供智能排版建议、内容纠错、自动摘要生成，助力高效创作
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">实时协作空间</h3>
            <p className="text-gray-600">
              支持200+人实时协同编辑，可视化操作记录，智能冲突解决，搭配团队知识库管理功能
            </p>
          </div>
        </div>
      </section>

      {/* Footer 页脚 */}
      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">
            © {new Date().getFullYear()} 银河云文档. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
