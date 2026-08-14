import Link from 'next/link';

export const metadata = {
  title: '版权声明 - 河图纹画',
};

export default function CopyrightPage() {
  return (
    <div className="min-h-screen bg-[#F5F3EE]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-xs text-gold hover:underline mb-8 inline-block">← 返回首页</Link>
        <h1 className="text-2xl font-serif font-semibold text-ink mb-2">版权声明</h1>
        <p className="text-xs text-gray-400 mb-8">最后更新：2026年7月5日</p>

        <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-lg font-serif font-semibold text-ink mt-8 mb-3">一、版权归属</h2>
            <p><b>本站所有纹样作品的版权归创作者所有。</b>包括但不限于：创新纹样的原创设计、复原纹样的数字扫描与描摹文件、纹样素材的手绘元素、网站文字内容与版面设计。</p>
            <p>本站在各产品页面标注的版权信息具有法律效力。未经书面授权，任何人不得主张本站纹样的版权。</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-ink mt-8 mb-3">二、使用授权说明</h2>
            <p>用户通过本站购买的纹样文件，获得的是<b>使用权许可</b>，而非版权所有权。具体授权范围以购买时选择的授权级别为准：</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><b>个人学习许可：</b>仅限个人欣赏、临摹、非商业分享；</li>
              <li><b>标准商业许可：</b>可用于实物产品、包装设计、自媒体配图等商业用途，不限印刷量；</li>
              <li><b>源文件企业授权（仅创新纹样）：</b>包含上述商业用途外加修改权和衍生创作权。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-ink mt-8 mb-3">三、非独家授权</h2>
            <p><b>所有授权均为非独家许可。</b>同一纹样可同时授权给不同客户使用。本站不提供任何形式的独家授权或版权买断。</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-ink mt-8 mb-3">四、禁止行为</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>将纹样文件本身作为商品直接转卖；</li>
              <li>将纹样授权转售或以子授权方式变相出售；</li>
              <li>将纹样元素注册为商标；</li>
              <li>冒用创作者身份或主张纹样的版权；</li>
              <li>未经许可对源文件进行分发或共享。</li>
            </ul>
            <p className="mt-3">如发现购买者将纹样注册商标，授权自动终止，本站保留追诉权利。</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-ink mt-8 mb-3">五、侵权投诉</h2>
            <p>如您发现本站内容涉嫌侵犯您的知识产权，请通过以下方式提交投诉：</p>
            <p><b>投诉邮箱：</b>studio@hetu-pattern.com</p>
            <p>请提供以下信息以协助核实：</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>权利人身份证明或授权委托书；</li>
              <li>涉嫌侵权内容的具体链接或页面描述；</li>
              <li>权利证明（如著作权登记证书、在先公开发表证明等）；</li>
              <li>联系方式。</li>
            </ul>
            <p className="mt-3">我们将在收到有效通知后7个工作日内处理。对恶意投诉，我们保留追究的权利。</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-ink mt-8 mb-3">六、联系方式</h2>
            <p>邮箱：studio@hetu-pattern.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}
