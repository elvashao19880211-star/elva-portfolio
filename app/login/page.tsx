'use client';

import { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumb';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <main className="min-h-screen px-6 py-20">
      <Breadcrumb crumbs={[{ label: '首页', href: '/' }, { label: mode === 'login' ? '登录' : '注册' }]} />

      <div className="max-w-sm mx-auto mt-10">
        {/* Logo 头 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-qing flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-2xl font-serif font-bold">河</span>
          </div>
          <h1 className="heading-3 text-ink">
            {mode === 'login' ? '欢迎回来' : '加入河图'}
          </h1>
          <p className="body-sm text-gray-400 mt-1">
            {mode === 'login' ? '登录后浏览完整纹样库' : '注册即可免费预览所有纹样'}
          </p>
        </div>

        {/* 切换 */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setSuccess(false); }}
              className={`flex-1 py-2 text-sm rounded-lg transition-all ${
                mode === m ? 'bg-white shadow-sm text-ink font-medium' : 'text-gray-400 hover:text-ink'
              }`}
            >
              {m === 'login' ? '登录' : '注册'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-qing focus:ring-1 focus:ring-qing/30 outline-none text-sm transition-all"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'login' ? '输入密码' : '设置密码（至少6位）'}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-qing focus:ring-1 focus:ring-qing/30 outline-none text-sm transition-all"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">确认密码</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="再次输入密码"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-qing focus:ring-1 focus:ring-qing/30 outline-none text-sm transition-all"
              />
            </div>
          )}

          <button type="submit" className="btn-ink w-full text-sm">
            {mode === 'login' ? '登录' : '创建账号'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-300 mt-6">
          {mode === 'login' ? (
            <>
              还没有账号？{' '}
              <button onClick={() => setMode('register')} className="text-qing hover:underline">
                立即注册
              </button>
            </>
          ) : (
            <>
              已有账号？{' '}
              <button onClick={() => setMode('login')} className="text-qing hover:underline">
                去登录
              </button>
            </>
          )}
        </p>

        <p className="text-center text-[10px] text-gray-200 mt-4">
          （当前为演示模式，实际注册与登录接口待接入）
        </p>
      </div>

      {/* 成功浮层 */}
      {success && (
        <div className="fixed top-24 right-6 z-50 bg-white rounded-xl shadow-lg border border-green-100 p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-ink">
              {mode === 'login' ? '登录成功！' : '注册成功！'}
            </p>
            <p className="text-xs text-gray-400">正在跳转...</p>
          </div>
        </div>
      )}
    </main>
  );
}
