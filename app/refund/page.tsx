import Link from 'next/link';

export const metadata = {
  title: '退款政策 - 河图纹样',
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-[#F5F3EE]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-xs text-gold hover:underline mb-8 inline-block">← 返回首页</Link>
        <h1 className="text-2xl font-serif font-semibold text-ink mb-2">退款政策</h1>
        <p className="text-xs text-gray-400 mb-8">最后更新：2026年7月5日</p>

        <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-lg font-serif font-semibold text-ink mt-8 mb-3">一、数字商品特性</h2>
            <p>本站出售的商品为数字纹样文件（图片、源文件等），属于<b>数字化商品</b>。根据《中华人民共和国消费者权益保护法》第二十五条，数字化商品一经交付即不适用七日无理由退货。</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-ink mt-8 mb-3">二、退款条件</h2>
            <p><b>一般情况下，已交付的数字商品不支持退款。</b></p>
            <p className="mt-2">以下情形可申请退款：</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><b>重复支付：</b>同一订单被多次扣款，可退还重复部分；</li>
              <li><b>未交付：</b>支付成功但72小时内未收到文件下载链接（经核实属本站原因）；</li>
              <li><b>文件损坏：</b>下载文件无法正常打开或显示（须在下载后48小时内反馈）。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-ink mt-8 mb-3">三、不予退款的情形</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>文件已成功下载且可正常使用；</li>
              <li>"不喜欢"、"不需要了"等主观原因；</li>
              <li>误购（请在下单前仔细确认授权级别）；</li>
              <li>购买后声称未使用或未下载；</li>
              <li>付款后超过7天未反馈问题。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-ink mt-8 mb-3">四、会员退款</h2>
            <p>素材库会员为年度订阅服务。首次购买会员后72小时内，如未下载任何素材文件，可申请全额退款。超过72小时或已下载素材，不支持退款。</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-ink mt-8 mb-3">五、退款流程</h2>
            <p>1. 发送退款申请至 studio@hetu-pattern.com，注明订单编号和退款原因；</p>
            <p>2. 我们将在3个工作日内核实并回复；</p>
            <p>3. 符合退款条件的，款项在确认后7个工作日内原路退回。</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-ink mt-8 mb-3">六、争议处理</h2>
            <p>如对退款处理结果有异议，可发送详细情况至上述邮箱。我们将本着诚信原则协商解决。</p>
          </section>
        </div>
      </div>
    </div>
  );
}
