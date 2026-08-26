import Link from 'next/link';

export const metadata = {
  title: '版权声明与授权条款 - 河图纹画',
};

export default function CopyrightPage() {
  return (
    <div className="min-h-screen bg-[#F5F3EE]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-xs text-gold hover:underline mb-8 inline-block">← 返回首页</Link>
        <h1 className="text-2xl font-serif font-semibold text-ink mb-2">版权声明与授权条款</h1>
        <p className="text-xs text-gray-400 mb-8">最后更新：2026年8月26日</p>

        <div className="space-y-8 text-gray-600 text-sm leading-relaxed">
          <section>
            <h2 className="font-serif font-semibold text-ink text-lg mb-3">一、版权归属</h2>
            <p>本站所有纹样作品的版权归创作者所有，包括但不限于：创新纹样的原创设计、复原纹样的数字扫描与描摹文件、纹样素材的手绘元素、网站文字内容与版面设计。</p>
            <p className="mt-2">本站在各产品页面标注的版权信息具有法律效力。未经书面授权，任何人不得主张本站纹样的版权。</p>
          </section>

          <section className="bg-red-50 border border-red-200 rounded-xl p-5">
            <h2 className="font-serif font-semibold text-red-700 text-lg mb-3">二、商标禁令</h2>
            <p className="text-red-700">
              禁止以任何形式、在任何地区，将纹样或其主要识别部分注册为商标，或作为未注册商标用于品牌标识。一经发现，我方有权立即终止授权，并追偿因侵权造成的全部损失。
            </p>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-ink text-lg mb-3">三、授权性质</h2>
            <p>本授权为非独占授权。同一纹样可同时授权给多个被授权人使用。我方不保证该纹样在市场上的唯一性，亦不承担因其他被授权人使用该纹样而产生的任何责任。</p>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-ink text-lg mb-3">四、个人学习许可（¥19.9/幅，含水印）</h2>
            <p className="mb-2">核心限制：不得用于以营利为目的的任何用途。</p>
            <p className="text-ink font-medium mb-1">可用</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>个人临摹、学习、收藏欣赏</li>
              <li>参赛、非商业表演</li>
              <li>非商业性分享（发布小红书、朋友圈、个人作品集等，请标注来源「@河图纹画」）</li>
            </ul>
            <p className="text-ink font-medium mt-3 mb-1">不可用（以营利为目的的行为，例如）</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>商品生产与销售</li>
              <li>广告推广、企业宣传</li>
              <li>付费交付设计（将纹样转卖给客户或嵌入商用项目）</li>
              <li>付费直播带货、电商销售</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-ink text-lg mb-3">五、标准商业许可（¥399/499/幅，无水印 + 授权书）</h2>
            <p className="text-ink font-medium mb-1">可用</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>商品包装与产品设计</li>
              <li>广告宣传物料（海报、企业宣传册等）</li>
              <li>影视、传媒、宣传片制作</li>
              <li>线下广告、展馆、会议、演出等实景用途</li>
            </ul>
            <p className="text-ink font-medium mt-3 mb-1">不可用</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>将纹样作为商品的主要视觉元素，用于装饰画、背景墙、地毯、手机壳、T恤等实物产品的生产与销售</li>
              <li>图书出版</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-ink text-lg mb-3">六、企业源文件授权（¥3,999/幅，PSD 源文件 + 修改权）</h2>
            <p className="text-ink font-medium mb-1">可用</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>涵盖标准商业许可的全部用途</li>
              <li>可将纹样用于实物产品的生产与销售</li>
              <li>可对纹样进行修改与衍生创作</li>
              <li>授权永久有效</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-ink text-lg mb-3">七、通用限制（所有档位均适用）</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>授权仅限购买者本人使用，不可转让、转售、子授权</li>
              <li>禁止声称拥有该纹样的著作权</li>
              <li>超范围使用即构成违约，授权自动终止</li>
              <li>购买即视为同意本条款</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-ink text-lg mb-3">八、违约与授权终止</h2>
            <p>授权因违约终止后，已制作完成但未售出的实物商品，自终止之日起 30 日内可继续销售，逾期须立即停止销售。</p>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-ink text-lg mb-3">九、侵权投诉</h2>
            <p>如您发现本站内容涉嫌侵犯您的知识产权，请通过 studio@hetu-pattern.com 提交投诉。</p>
            <p className="mt-2">请提供以下信息以协助核实：</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>权利人身份证明或授权委托书</li>
              <li>涉嫌侵权内容的具体链接或页面描述</li>
              <li>权利证明（如著作权登记证书、在先公开发表证明等）</li>
              <li>联系方式</li>
            </ul>
            <p className="mt-2">我们将在收到有效通知后 7 个工作日内处理。对恶意投诉，我们保留追究的权利。</p>
          </section>

          <section>
            <h2 className="font-serif font-semibold text-ink text-lg mb-3">十、联系方式</h2>
            <p>邮箱：studio@hetu-pattern.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}
