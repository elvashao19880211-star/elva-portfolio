import Link from 'next/link';

export const metadata = {
  title: '用户协议 - 河图纹样',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F5F3EE]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-xs text-gold hover:underline mb-8 inline-block">← 返回首页</Link>
        <h1 className="text-2xl font-serif font-semibold text-ink mb-2">用户协议</h1>
        <p className="text-xs text-gray-400 mb-8">最后更新：2026年7月5日</p>

        <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-lg font-serif font-semibold text-ink mt-8 mb-3">一、协议范围</h2>
            <p>本协议是您（以下简称"用户"）与河图纹样网站（www.hetu-pattern.com，以下简称"本站"）之间关于使用本站服务所订立的协议。注册或使用本站即表示您同意本协议全部条款。</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-ink mt-8 mb-3">二、账号注册与安全</h2>
            <p>2.1 用户注册时需提供真实、准确的个人信息（邮箱或手机号）。因信息不实导致的任何后果由用户自行承担。</p>
            <p>2.2 用户应妥善保管账号密码，不得将账号出借、转让或与他人共享。通过该账号进行的一切操作均视为用户本人行为。</p>
            <p>2.3 本站有权在发现异常登录或违规行为时暂停或终止账号服务。</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-ink mt-8 mb-3">三、内容版权与授权</h2>
            <p>3.1 本站所有纹样作品的<b>版权归创作者所有</b>。用户购买的是使用权许可，而非版权所有权。</p>
            <p>3.2 所有授权均为<b>非独家许可</b>。同一纹样可持续授权给不同客户。</p>
            <p>3.3 <b>不提供买断授权</b>。不存在任何形式的版权买断。</p>
            <p>3.4 各授权级别的具体权利与限制，请参见各产品页面的授权说明。</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-ink mt-8 mb-3">四、禁止事项</h2>
            <p>用户在使用本站内容时，<b>严禁以下行为</b>：</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>将购买的纹样文件作为商品直接二次销售；</li>
              <li>将纹样授权给第三方（子授权）；</li>
              <li>将纹样元素注册为商标；</li>
              <li>冒充纹样原作者或主张纹样的版权；</li>
              <li>利用本站内容从事违法活动。</li>
            </ul>
            <p className="mt-3">如发现上述行为，授权自动终止，本站保留追究法律责任的权利。</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-ink mt-8 mb-3">五、退款政策</h2>
            <p>数字商品一经下载即视为交付完成。详情请参见 <Link href="/refund" className="text-gold hover:underline">退款政策</Link>。</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-ink mt-8 mb-3">六、免责声明</h2>
            <p>6.1 本站按现状提供服务，不对服务的持续性、时效性、安全性作绝对保证。</p>
            <p>6.2 因不可抗力、系统维护、网络故障等导致的服务中断，本站不承担责任。</p>
            <p>6.3 用户因违反本协议或不当使用本站内容导致的任何第三方索赔，由用户自行承担。</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-ink mt-8 mb-3">七、协议变更</h2>
            <p>本站有权适时修改本协议。修改后的协议将在本站发布后生效。重大变更将通过站内通知或邮件告知。继续使用本站即视为接受修改后的协议。</p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-semibold text-ink mt-8 mb-3">八、联系方式</h2>
            <p>如对本协议有任何疑问，请通过以下方式联系：</p>
            <p>邮箱：elva@hetu-pattern.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}
