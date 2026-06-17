'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Breadcrumb from '../../components/Breadcrumb';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [account, setAccount] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [phoneConfirm, setPhoneConfirm] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // 注册时选择邮箱还是手机号
  const [regType, setRegType] = useState<'email' | 'phone'>('email');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '登录失败');
        return;
      }

      router.push(redirect);
      router.refresh();
    } catch {
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('两次密码不一致');
      return;
    }

    if (regType === 'email') {
      if (!email) { setError('请填写邮箱'); return; }
      if (email !== emailConfirm) { setError('两次邮箱不一致'); return; }
    }
    if (regType === 'phone') {
      if (!phone) { setError('请填写手机号'); return; }
      if (phone !== phoneConfirm) { setError('两次手机号不一致'); return; }
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: regType === 'email' ? email : undefined,
          phone: regType === 'phone' ? phone : undefined,
          password,
          nickname,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '注册失败');
        return;
      }

      // 注册成功后自动登录
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account: regType === 'email' ? email : phone,
          password,
        }),
      });

      if (loginRes.ok) {
        router.push(redirect);
        router.refresh();
      }
    } catch {
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
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
              onClick={() => { setMode(m); setError(''); }}
              className={`flex-1 py-2 text-sm rounded-lg transition-all ${
                mode === m ? 'bg-white shadow-sm text-ink font-medium' : 'text-gray-400 hover:text-ink'
              }`}
            >
              {m === 'login' ? '登录' : '注册'}
            </button>
          ))}
        </div>

        <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
          {/* 昵称（仅注册） */}
          {mode === 'register' && (
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">昵称 <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="你的昵称"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-qing focus:ring-1 focus:ring-qing/30 outline-none text-sm transition-all"
              />
            </div>
          )}

          {mode === 'login' ? (
            /* 登录：一个账号框，支持邮箱、手机号或昵称 */
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">邮箱 / 手机号 / 昵称 <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="输入任意一种方式登录"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-qing focus:ring-1 focus:ring-qing/30 outline-none text-sm transition-all"
              />
            </div>
          ) : (
            /* 注册：邮箱和手机号任选一个 */
            <>
              <div className="flex bg-gray-100 rounded-xl p-1 mb-1">
                {(['email', 'phone'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { setRegType(t); setError(''); }}
                    className={`flex-1 py-1.5 text-xs rounded-lg transition-all ${
                      regType === t ? 'bg-white shadow-sm text-ink font-medium' : 'text-gray-400 hover:text-ink'
                    }`}
                  >
                    {t === 'email' ? '📧 邮箱注册' : '📱 手机号注册'}
                  </button>
                ))}
              </div>

              {regType === 'email' ? (
                <>
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">邮箱 <span className="text-red-400">*</span></label>
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
                    <label className="text-xs text-gray-500 mb-1.5 block">确认邮箱 <span className="text-red-400">*</span></label>
                    <input
                      type="email"
                      value={emailConfirm}
                      onChange={(e) => setEmailConfirm(e.target.value)}
                      placeholder="再次输入邮箱"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-qing focus:ring-1 focus:ring-qing/30 outline-none text-sm transition-all"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">手机号 <span className="text-red-400">*</span></label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="13812345678"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-qing focus:ring-1 focus:ring-qing/30 outline-none text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">确认手机号 <span className="text-red-400">*</span></label>
                    <input
                      type="tel"
                      value={phoneConfirm}
                      onChange={(e) => setPhoneConfirm(e.target.value)}
                      placeholder="再次输入手机号"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-qing focus:ring-1 focus:ring-qing/30 outline-none text-sm transition-all"
                    />
                  </div>
                </>
              )}
            </>
          )}

          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">密码 <span className="text-red-400">*</span></label>
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
              <label className="text-xs text-gray-500 mb-1.5 block">确认密码 <span className="text-red-400">*</span></label>
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

          {error && (
            <div className="bg-red-50 text-red-500 text-xs rounded-lg px-4 py-2.5">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-ink w-full text-sm disabled:opacity-60">
            {loading ? '处理中...' : mode === 'login' ? '登录' : '创建账号'}
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
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-qing border-t-transparent rounded-full animate-spin" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
