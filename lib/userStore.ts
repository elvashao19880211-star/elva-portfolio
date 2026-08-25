import { hashPassword, verifyPassword } from './auth';
import { Redis } from '@upstash/redis';

export interface User {
  id: string;
  email?: string;
  phone?: string;
  passwordHash: string;
  nickname: string;
  createdAt: string;
  memberTier?: string;      // 会员档位（personal / commercial）
  memberExpiresAt?: string; // 会员到期时间（ISO）
  avatar?: string;          // 头像（base64 data URL）
}

// ============================================================
// 用户存储 - Upstash Redis (Vercel生产) + JSON 文件 (本地开发)
// ============================================================

const isProd = typeof process !== 'undefined' && process.env.UPSTASH_REDIS_REST_URL;

class JsonUserStore {
  private users: User[] = [];

  async init() {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'data', 'users.json');
      try {
        const data = await fs.readFile(filePath, 'utf-8');
        this.users = JSON.parse(data);
      } catch {
        this.users = [];
      }
    } catch {
      this.users = [];
    }
  }

  private async save() {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'data', 'users.json');
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(this.users, null, 2), 'utf-8');
    } catch {}
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email?.toLowerCase() === email.toLowerCase()) || null;
  }
  async findByPhone(phone: string): Promise<User | null> {
    return this.users.find(u => u.phone === phone) || null;
  }
  async findByNickname(nickname: string): Promise<User | null> {
    return this.users.find(u => u.nickname === nickname) || null;
  }
  async findById(id: string): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }
  async create(user: User): Promise<void> {
    this.users.push(user);
    await this.save();
  }
  async activateMember(email: string, tier: string, days: number): Promise<boolean> {
    const u = this.users.find(x => x.email?.toLowerCase() === email.toLowerCase());
    if (!u) return false;
    const now = Date.now();
    const cur = u.memberExpiresAt ? new Date(u.memberExpiresAt).getTime() : 0;
    const base = cur > now ? cur : now;
    u.memberTier = tier;
    u.memberExpiresAt = new Date(base + days * 86400000).toISOString();
    await this.save();
    return true;
  }
  async updateAvatar(id: string, avatar: string): Promise<boolean> {
    const u = this.users.find(x => x.id === id);
    if (!u) return false;
    u.avatar = avatar;
    await this.save();
    return true;
  }
  async updatePassword(id: string, passwordHash: string): Promise<boolean> {
    const u = this.users.find(x => x.id === id);
    if (!u) return false;
    u.passwordHash = passwordHash;
    await this.save();
    return true;
  }
}

class RedisUserStore {
  private redis: Redis | null = null;

  private async getClient() {
    if (this.redis) return this.redis;
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
    return this.redis;
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const redis = await this.getClient();
      const key = email.toLowerCase();
      const id = await redis.get(`user:email:${key}`);
      if (!id) return null;
      const data = await redis.get(`user:${id}`);
      return data ? (typeof data === 'string' ? JSON.parse(data) : data) : null;
    } catch (e: any) { console.error('Redis findByEmail:', e.message); return null; }
  }

  async findByPhone(phone: string): Promise<User | null> {
    try {
      const redis = await this.getClient();
      const id = await redis.get(`user:phone:${phone}`);
      if (!id) return null;
      const data = await redis.get(`user:${id}`);
      return data ? (typeof data === 'string' ? JSON.parse(data) : data) : null;
    } catch (e: any) { console.error('Redis findByPhone:', e.message); return null; }
  }

  async findByNickname(nickname: string): Promise<User | null> {
    try {
      const redis = await this.getClient();
      const id = await redis.get(`user:nickname:${nickname}`);
      if (!id) return null;
      const data = await redis.get(`user:${id}`);
      return data ? (typeof data === 'string' ? JSON.parse(data) : data) : null;
    } catch (e: any) { console.error('Redis findByNickname:', e.message); return null; }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const redis = await this.getClient();
      const data = await redis.get(`user:${id}`);
      return data ? (typeof data === 'string' ? JSON.parse(data) : data) : null;
    } catch (e: any) { console.error('Redis findById:', e.message); return null; }
  }

  async create(user: User): Promise<void> {
    try {
      const redis = await this.getClient();
      const data = JSON.stringify(user);
      await redis.set(`user:${user.id}`, data);
      if (user.email) await redis.set(`user:email:${user.email.toLowerCase()}`, user.id);
      if (user.phone) await redis.set(`user:phone:${user.phone}`, user.id);
      await redis.set(`user:nickname:${user.nickname}`, user.id);
    } catch (e: any) {
      throw new Error(`Redis写入失败: ${e.message || e}`);
    }
  }

  async activateMember(email: string, tier: string, days: number): Promise<boolean> {
    try {
      const redis = await this.getClient();
      const id = await redis.get(`user:email:${email.toLowerCase()}`);
      if (!id) return false;
      const data = await redis.get(`user:${id}`);
      if (!data) return false;
      const user: User = typeof data === 'string' ? JSON.parse(data) : data;
      const now = Date.now();
      const cur = user.memberExpiresAt ? new Date(user.memberExpiresAt).getTime() : 0;
      const base = cur > now ? cur : now;
      user.memberTier = tier;
      user.memberExpiresAt = new Date(base + days * 86400000).toISOString();
      await redis.set(`user:${id}`, JSON.stringify(user));
      return true;
    } catch {
      return false;
    }
  }

  async updateAvatar(id: string, avatar: string): Promise<boolean> {
    try {
      const redis = await this.getClient();
      const data = await redis.get(`user:${id}`);
      if (!data) return false;
      const user: User = typeof data === 'string' ? JSON.parse(data) : data;
      user.avatar = avatar;
      await redis.set(`user:${id}`, JSON.stringify(user));
      return true;
    } catch {
      return false;
    }
  }
  async updatePassword(id: string, passwordHash: string): Promise<boolean> {
    try {
      const redis = await this.getClient();
      const data = await redis.get(`user:${id}`);
      if (!data) return false;
      const user: User = typeof data === 'string' ? JSON.parse(data) : data;
      user.passwordHash = passwordHash;
      await redis.set(`user:${id}`, JSON.stringify(user));
      return true;
    } catch {
      return false;
    }
  }
}

const store = isProd ? new RedisUserStore() : new JsonUserStore();

let initialized = false;
async function ensureInit() {
  if (initialized) return;
  if (store instanceof JsonUserStore) await store.init();
  initialized = true;
}

// ============================================================
// 公开 API
// ============================================================

export async function registerUser(
  email: string | undefined,
  phone: string | undefined,
  password: string,
  nickname: string
): Promise<{ success: boolean; error?: string; user?: Omit<User, 'passwordHash'> }> {
  await ensureInit();
  const useEmail = email?.trim();
  const usePhone = phone?.trim();
  if (!useEmail && !usePhone) return { success: false, error: '请填写邮箱或手机号' };
  if (!password || !nickname) return { success: false, error: '请填写所有必填字段' };
  if (password.length < 6) return { success: false, error: '密码至少6位' };
  if (useEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(useEmail)) return { success: false, error: '邮箱格式不正确' };
  if (usePhone && !/^1\d{10}$/.test(usePhone)) return { success: false, error: '手机号格式不正确' };

  if (useEmail && await store.findByEmail(useEmail)) return { success: false, error: '该邮箱已注册' };
  if (usePhone && await store.findByPhone(usePhone)) return { success: false, error: '该手机号已注册' };

  const id = crypto.randomUUID();
  const passwordHash = await hashPassword(password);
  const user: User = {
    id,
    email: useEmail?.toLowerCase() || undefined,
    phone: usePhone || undefined,
    passwordHash,
    nickname: nickname.trim(),
    createdAt: new Date().toISOString(),
  };

  try {
    await store.create(user);
  } catch (e: any) {
    return { success: false, error: `存储写入失败: ${e.message || e}` };
  }

  const { passwordHash: _, ...safeUser } = user;
  return { success: true, user: safeUser };
}

export async function loginUser(
  account: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: Omit<User, 'passwordHash'> }> {
  try {
    await ensureInit();
    if (!account || !password) return { success: false, error: '请输入账号和密码' };

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account);
    const isPhone = /^1\d{10}$/.test(account);

    let user: User | null = null;
    if (isEmail) user = await store.findByEmail(account);
    else if (isPhone) user = await store.findByPhone(account);
    else user = await store.findByNickname(account);

    if (!user) return { success: false, error: '账号不存在' };
    if (!user.passwordHash) return { success: false, error: '账号数据异常，请联系管理员' };

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) return { success: false, error: '密码错误' };

    const { passwordHash: _, ...safeUser } = user;
    return { success: true, user: safeUser };
  } catch (e: any) {
    console.error('loginUser error:', e.message || e);
    return { success: false, error: `登录服务异常: ${e.message || e}` };
  }
}

export async function getUserById(id: string): Promise<Omit<User, 'passwordHash'> | null> {
  await ensureInit();
  const user = await store.findById(id);
  if (!user) return null;
  const { passwordHash: _, ...safeUser } = user;
  return safeUser;
}

export async function activateMember(
  email: string,
  tier: string,
  days: number
): Promise<boolean> {
  await ensureInit();
  return store.activateMember(email, tier, days);
}

export async function updateUserAvatar(id: string, avatar: string): Promise<boolean> {
  await ensureInit();
  return store.updateAvatar(id, avatar);
}

/** 检查邮箱是否已注册（忘记密码发送验证码前用） */
export async function userExistsByEmail(email: string): Promise<boolean> {
  await ensureInit();
  return !!(await store.findByEmail(email));
}

/** 重置密码（忘记密码流程，已验证验证码后调用） */
export async function resetPassword(
  email: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  await ensureInit();
  const useEmail = email?.trim().toLowerCase();
  if (!useEmail) return { success: false, error: '请填写邮箱' };
  if (!newPassword || newPassword.length < 6) return { success: false, error: '新密码至少6位' };

  const user = await store.findByEmail(useEmail);
  if (!user) return { success: false, error: '该邮箱尚未注册' };

  const passwordHash = await hashPassword(newPassword);
  const ok = await store.updatePassword(user.id, passwordHash);
  if (!ok) return { success: false, error: '密码更新失败，请重试' };
  return { success: true };
}
