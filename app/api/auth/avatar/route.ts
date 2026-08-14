import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { updateUserAvatar } from '@/lib/userStore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: '未登录' }, { status: 401 });
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: '未登录' }, { status: 401 });

    const body = await req.json();
    const avatar = body?.avatar;
    if (!avatar || typeof avatar !== 'string') {
      return NextResponse.json({ error: '参数不合法' }, { status: 400 });
    }
    // 只接受 base64 data URL（png/jpeg/webp）
    if (!/^data:image\/(png|jpe?g|webp);base64,/.test(avatar)) {
      return NextResponse.json({ error: '头像格式不支持' }, { status: 400 });
    }
    // 限制大小（base64 字符数 < 256KB，解码后约 190KB）
    if (avatar.length > 256 * 1024) {
      return NextResponse.json({ error: '头像过大，请压缩后重试' }, { status: 400 });
    }

    const ok = await updateUserAvatar(payload.id, avatar);
    if (!ok) return NextResponse.json({ error: '更新失败' }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
