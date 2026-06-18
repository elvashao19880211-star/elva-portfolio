import { hashPassword, verifyPassword } from './auth';
import { Redis } from '@upstash/redis';

export interface User {
  id: string;
  email?: string;
  phone?: string;
  passwordHash: string;
  nickname: string;
  createdAt: string;
}

// ============================================================
// 用户存储 - Upstash Redis (生产) + JSON 文件 (本地开发)
// ============================================================

// 判断生产环境
const isProd = typeof process !== 'undefined' && process.env.UPSTASH_REDIS_REST_URL;

// JSON 文件存储（本地开发用）
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
    return this.users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase()) || null;
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
}

// Redis 存储（Vercel 生产环境）
class RedisUserStore {
  private redis: any | null = null;

  private async getClient() {
    if (this.redis) return this.redis;
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
    return this.redis;
  }

  async findByEmail(email: string): Promise<User | null> {
    const redis = await this.getClient();
    const key = email.toLowerCase();
    const id = await redis.get(`user:email:${key}`);
    if (!id) return null;
    const data = await redis.get(`user:${id}`);
    return data ? JSON.parse(data as string) : null;
  }

  async findByPhone(phone: string): Promise<User | null> {
    const redis = await this.getClient();
    const id = await redis.get(`user:phone:${phone}`);
    if (!id) return null;
    const data = await redis.get(`user:${id}`);
    return data ? JSON.parse(data as string) : null;
  }

  async findByNickname(nickname: string): Promise<User | null> {
    const redis = await this.getClient();
    const id = await redis.get(`user:nickname:${nickname}`);
    if (!id) return null;
    const data = await redis.get(`user:${id}`);
    return data ? JSON.parse(data as string) : null;
  }

  async findById(id: string): Promise<User | null> {
    const redis = await this.getClient();
    const data = await redis.get(`user:${id}`);
    return data ? JSON.parse(data as string) : null;
  }

  async create(user: User): Promise<void> {
    try {
      const redis = await this.getClient();
      const data = JSON.stringify(user);
      await redis.set(`user:${user.id}`, data);

      if (user.email) {
        await redis.set(`user:email:${user.email.toLowerCase()}`, user.id);
      }
      if (user.phone) {
        await redis.set(`user:phone:${user.phone}`, user.id);
      }
      await redis.set(`user:nickname:${user.nickname}`, user.id);
    } catch (e: any) {
      throw new Error(`Redis写入失败: ${e.message || e}`);
    }
  }
}

const store = isProd ? new RedisUserStore() : new JsonUserStore();

let initialized = false;

async function ensureInit() {
  if (initialized) return;
  if (store instanceof JsonUserStore) {
    await store.init();
  }
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
  if (!useEmail && !usePhone) {
    return { success: false, error: '请填写邮箱或手机号' };
  }
  if (!password || !nickname) {
    return { success: false, error: '请填写所有必填字段' };
  }
  if (password.length < 6) {
    return { success: false, error: '密码至少6位' };
  }
  if (useEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(useEmail)) {
    return { success: false, error: '邮箱格式不正确' };
  }
  if (usePhone && !/^1\d{10}$/.test(usePhone)) {
    return { success: false, error: '手机号格式不正确' };
  }

  // 检查是否已存在
  if (useEmail && await store.findByEmail(useEmail)) {
    return { success: false, error: '该邮箱已注册' };
  }
  if (usePhone && await store.findByPhone(usePhone)) {
    return { success: false, error: '该手机号已注册' };
  }

  // 创建用户
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
  await ensureInit();

  if (!account || !password) {
    return { success: false, error: '请输入账号和密码' };
  }

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account);
  const isPhone = /^1\d{10}$/.test(account);

  let user: User | null = null;
  if (isEmail) {
    user = await store.findByEmail(account);
  } else if (isPhone) {
    user = await store.findByPhone(account);
  } else {
    user = await store.findByNickname(account);
  }

  if (!user) {
    return { success: false, error: '账号不存在' };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { success: false, error: '密码错误' };
  }

  const { passwordHash: _, ...safeUser } = user;
  return { success: true, user: safeUser };
}

export async function getUserById(id: string): Promise<Omit<User, 'passwordHash'> | null> {
  await ensureInit();
  const user = await store.findById(id);
  if (!user) return null;
  const { passwordHash: _, ...safeUser } = user;
  return safeUser;
}
