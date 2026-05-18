# Elva Studio Portfolio Framework

这是一个可扩展的 Next.js + Tailwind CSS 网站骨架，风格为「现代中式 · 极简东方」。

## 🎨 配色方案
- **主色（天青）**: `#A4C3B2`
- **辅色（淡金）**: `#C3A370`
- **点缀（墨蓝）**: `#3A506B`

## 📁 目录结构
```
app/
  ├─ page.tsx              # 首页（含 Hero + 精选纹样 + CTA）
  ├─ patterns/             # 纹样作品（含复原 / 创新）
  │    ├─ page.tsx
  │    ├─ revival/page.tsx
  │    └─ innovation/page.tsx
  ├─ materials/page.tsx    # 纹样素材板块
  ├─ community/page.tsx    # 交流区（小组讨论）
  └─ cooperation/page.tsx  # 企业合作板块
components/
  ├─ Navbar.tsx
  ├─ Footer.tsx
  └─ SectionTitle.tsx
public/
  └─ images/               # 静态素材目录
globals.css                # 全局样式
next.config.js             # Next.js 配置
tailwind.config.js         # Tailwind 配色设置
```

## 🧱 特点
- 清晰模块化结构，方便后续扩展和调整。
- 所有页面采用统一配色和留白系统。
- 首页可快速替换图片与文案。

## 🚀 使用
1. 将该模板复制到你的项目路径 `E:/Elvasite/elva-portfolio`。
2. 执行 `npm install` 然后 `npm run dev` 启动开发环境。
3. 可根据需求修改任意页面、配色或组件样式。

---

🧩 **后续扩展建议**
- 加入作品数据模型（JSON / CMS）
- 交流区集成评论系统（如 Supabase / Firebase）
- 动态主题切换（浅色 / 深色）
