import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* 左侧 Logo */}
        <Link href="/" className="text-2xl font-semibold text-gray-900">
          Elva 纹样平台
        </Link>

        {/* 中间导航菜单 */}
        <div className="hidden md:flex gap-6 text-gray-700 font-medium">
          <Link href="/">首页</Link>
          <Link href="/heritage">复原纹样</Link>
          <Link href="/creative">创新纹样</Link>
          <Link href="/designers">创作者平台</Link>
          <Link href="/community">交流社区</Link>
          <Link href="/enterprise">企业合作</Link>
          <Link href="/join">签约合作</Link>
        </div>

        {/* 右侧动作按钮 */}
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800">
            登录
          </button>
          <button className="px-4 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100">
            注册
          </button>
        </div>
      </div>
    </nav>
  )
}