export default function Footer() {
  return (
    <footer className="bg-qing text-white text-sm">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* 品牌 */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-white font-serif font-semibold text-base mb-3">河图</h4>
            <p className="text-white/50 text-xs leading-relaxed">
              传承东方纹样之美
              <br />
              复原 · 创新 · 分享
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h5 className="text-white/90 text-xs font-medium uppercase tracking-wider mb-3">
              浏览
            </h5>
            <ul className="space-y-2">
              {[
                { label: '纹样库', href: '/patterns' },
                { label: '素材库', href: '/materials' },
                { label: '复原记录', href: '/heritage' },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-white/50 hover:text-gold transition-colors text-xs">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 互动 */}
          <div>
            <h5 className="text-white/90 text-xs font-medium uppercase tracking-wider mb-3">
              互动
            </h5>
            <ul className="space-y-2">
              {[
                { label: '交流区', href: '/community' },
                { label: '合作咨询', href: '/cooperation' },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-white/50 hover:text-gold transition-colors text-xs">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 社交 */}
          <div>
            <h5 className="text-white/90 text-xs font-medium uppercase tracking-wider mb-3">
              找到我
            </h5>
            <div className="space-y-2 text-xs text-white/50">
              <p>小红书：@Elva纹样设计</p>
              <p>微信：elva_pattern</p>
            </div>
          </div>
        </div>

        {/* 版权声明 */}
        <div className="pt-6 border-t border-white/10 text-center space-y-2">
          <p className="text-white/70 text-xs">
            © {new Date().getFullYear()} 河图 · 华夏纹样传承 版权所有
          </p>
          <p className="text-white/40 text-[10px] max-w-2xl mx-auto leading-relaxed">
            本站所有纹样作品（含复原纹样、创新设计、素材图片及相关文字说明）均为原创智力成果，
            受《中华人民共和国著作权法》保护。未经权利人书面许可，禁止以任何形式复制、转载、修改、传播或用于商业用途。
            侵权必究。授权合作请联系 <span className="text-gold/80">elva_pattern</span>。
          </p>
        </div>
      </div>
    </footer>
  );
}
