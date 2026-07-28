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
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [regType, setRegType] = useState<'email' | 'phone'>('phone');

  // 邮箱验证相关
  const [sendingCode, setSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ account: account?.trim(), password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '登录失败');
        return;
      }

      await new Promise(r => setTimeout(r, 300));
      window.location.href = redirect;
    } catch {
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async () => {
    setError('');
    if (regType === 'email' && !email) {
      setError('请先填写邮箱');
      return;
    }
    if (regType === 'phone' && !phone) {
      setError('请先填写手机号');
      return;
    }

    setSendingCode(true);
    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: regType === 'email' ? email : undefined }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '发送失败');
        return;
      }

      setVerificationToken(data.token);
      setCodeSent(true);
      // 开发模式显示验证码
      if (data.hint) setError(`[开发模式] ${data.hint}`);
    } catch {
      setError('网络错误');
    } finally {
      setSendingCode(false);
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
      if (!verificationCode) { setError('请输入验证码'); return; }
    }
    if (regType === 'phone' && !phone) {
      setError('请填写手机号'); return;
    }

    if (!agreeTerms) {
      setError('请先阅读并同意用户协议');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: regType === 'email' ? email : undefined,
          phone: regType === 'phone' ? phone : undefined,
          password,
          nickname,
          code: verificationCode || undefined,
          token: verificationToken || undefined,
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
        credentials: 'include',
        body: JSON.stringify({
          account: (regType === 'email' ? email : phone)?.trim(),
          password,
        }),
      });

      if (loginRes.ok) {
        await new Promise(r => setTimeout(r, 300));
        window.location.href = redirect;
      } else {
        const loginData = await loginRes.json().catch(() => ({}));
        setError('注册成功，但自动登录失败：' + (loginData.error || loginRes.status));
      }
    } catch (e: any) {
      setError('网络错误：' + (e?.message || '请重试'));
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
            /* 注册：邮箱和手机号任选 */
            <>
              <div className="flex bg-gray-100 rounded-xl p-1 mb-1">
                {(['phone', 'email'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { setRegType(t); setError(''); setCodeSent(false); setVerificationCode(''); }}
                    className={`flex-1 py-1.5 text-xs rounded-lg transition-all ${
                      regType === t ? 'bg-white shadow-sm text-ink font-medium' : 'text-gray-400 hover:text-ink'
                    }`}
                  >
                    {t === 'phone' ? '📱 手机号' : '📧 邮箱'}
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
                      onChange={(e) => { setEmail(e.target.value); setCodeSent(false); }}
                      placeholder="your@email.com"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-qing focus:ring-1 focus:ring-qing/30 outline-none text-sm transition-all"
                    />
                  </div>

                  {/* 邮箱验证码 */}
                  <div>

                    <label className="text-xs text-gray-500 mb-1.5 block">邮箱验证码 <span className="text-red-400">*</span></label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="6位数字"
                        maxLength={6}
                        required
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-qing focus:ring-1 focus:ring-qing/30 outline-none text-sm transition-all"
                      />
                      <button
                        type="button"
                        onClick={handleSendCode}
                        disabled={sendingCode || codeSent}
                        className="px-4 py-3 rounded-xl bg-qing text-white text-xs font-medium hover:bg-qing/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
                      >
                        {sendingCode ? '发送中...' : codeSent ? '已发送' : '发送验证码'}
                      </button>
                    </div>
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
            <div className={`rounded-lg px-4 py-2.5 text-xs ${error.startsWith('[开发模式]') ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-500'}`}>
              {error}
            </div>
          )}

          {mode === 'register' && (
            <label className="flex items-start gap-2 text-xs text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 accent-qing"
              />
              <span>
                我已阅读并同意{' '}
                <a href="/terms" target="_blank" className="text-qing hover:underline">用户协议</a>
                {' '}和{' '}
                <a href="/privacy" target="_blank" className="text-qing hover:underline">隐私政策</a>
              </span>
            </label>
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
  // v3 - 去掉二次确认，添加验证码流程
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-qing border-t-transparent rounded-full animate-spin" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
