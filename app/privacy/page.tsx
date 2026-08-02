import Link from 'next/link';

export const metadata = {
  title: '隐私政策 - 河图纹样',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F5F3EE]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-xs text-gold hover:underline mb-8 inline-block">← 返回首页</Link>
        <h1 className="text-2xl font-serif font-semibold text-ink mb-2">隐私政策</h1>
        <p className="text-xs text-gray-400 mb-8">最后更新：2026年7月5日</p>

        <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-lg font-serif font-semibold text-ink mt-8 mb-3">一、我们收集什么信息</h2>
            <p>在注册和使用本站过程中，我们可能收集以下信息：</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><b>注册信息：</b>昵称、邮箱地址或手机号码、加密存储的密码；</li>
              <li><b>浏览信息：</b>访问记录、浏览偏好（通过 Cookie）；</li>
              <li><b>交易信息：</b>购买记录、授权类型（不含支付密码或银行卡信息，支付由支付宝完成）。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-ink mt-8 mb-3">二、我们如何使用信息</h2>
            <p>收集的信息仅用于以下目的：</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>提供账号注册与登录服务；</li>
              <li>处理购买授权与文件交付；</li>
              <li>改善网站体验与内容推荐；</li>
              <li>发送必要的服务通知（如账号安全提醒、授权到期提醒）。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-ink mt-8 mb-3">三、信息存储与保护</h2>
            <p>3.1 用户数据存储于加密服务器，密码经单向哈希加密不可逆。</p>
            <p>3.2 我们采取合理的技术手段保护用户数据，但无法保证绝对安全。如发生数据泄露，我们将第一时间通知受影响用户。</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-ink mt-8 mb-3">四、信息共享</h2>
            <p><b>我们不会出售您的个人信息。</b>仅在以下情况下可能共享：</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>获得您的明确同意；</li>
              <li>法律法规要求或政府机关依法调取；</li>
              <li>与提供网站基础设施服务的第三方（如云服务商）共享必要数据，且约束其保密义务。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-ink mt-8 mb-3">五、Cookie</h2>
            <p>本站使用必要的 Cookie 以维持登录状态和会话管理。您可以在浏览器设置中禁用 Cookie，但可能导致部分功能无法正常使用。</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-ink mt-8 mb-3">六、您的权利</h2>
            <p>您有权：</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>查询、更正您的个人信息；</li>
              <li>删除您的账号及相关数据（不含依法须保留的交易记录）；</li>
              <li>撤回对非必要信息收集的同意。</li>
            </ul>
            <p className="mt-3">如需行使上述权利，请通过下方联系方式与我们联系。</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-ink mt-8 mb-3">七、未成年人保护</h2>
            <p>本站服务面向成年人。未满18周岁的用户应在监护人指导下使用。</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-ink mt-8 mb-3">八、政策更新</h2>
            <p>本政策可能适时更新，更新后在本站发布即生效。重大变更将通过站内通知。</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-ink mt-8 mb-3">九、联系方式</h2>
            <p>邮箱：studio@hetu-pattern.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}
