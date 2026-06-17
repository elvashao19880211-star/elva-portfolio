import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendVerificationCode(
  to: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    // 本地开发模式 - 打印验证码到控制台
    console.log(`\n📧 验证码: ${code} → 发送给: ${to}\n`);
    return { success: true };
  }

  try {
    const { error } = await resend.emails.send({
      from: '河图 <noreply@hetu-pattern.com>',
      to,
      subject: '验证码 - 河图 · 华夏纹样传承',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 32px;">🏮</span>
          </div>
          <h2 style="color: #3A506B; text-align: center; margin-bottom: 8px;">验证你的邮箱</h2>
          <p style="color: #666; text-align: center; font-size: 14px; margin-bottom: 24px;">
            你正在注册河图·华夏纹样传承账号
          </p>
          <div style="background: #f7f8fa; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 12px; color: #999; display: block; margin-bottom: 8px;">验证码</span>
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #3A506B; font-family: monospace;">${code}</span>
          </div>
          <p style="text-align: center; font-size: 12px; color: #aaa;">
            验证码 10 分钟内有效 · 如非本人操作请忽略此邮件
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend 发送失败:', error);
      return { success: false, error: '邮件发送失败' };
    }

    return { success: true };
  } catch (err) {
    console.error('Resend 异常:', err);
    return { success: false, error: '邮件服务异常' };
  }
}
