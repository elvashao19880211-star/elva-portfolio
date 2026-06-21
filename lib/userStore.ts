import { hashPassword, verifyPassword } from './auth';

export interface User {
  id: string;
  email?: string;
  phone?: string;
  passwordHash: string;
  nickname: string;
  createdAt: string;
}

// ============================================================
// 用户存储 - JSON 文件（本地 + Vercel）
// TODO: 后续迁移到 Upstash Redis REST API（不依赖 @upstash/redis SDK）
// ============================================================

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
    // Vercel serverless 文件系统不可写，跳过写入
    if (process.env.VERCEL) return;
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

const userStore = new JsonUserStore();

let initialized = false;

async function ensureInit() {
  if (!initialized) {
    await userStore.init();
    initialized = true;
  }
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

  if (useEmail && await userStore.findByEmail(useEmail)) {
    return { success: false, error: '该邮箱已注册' };
  }
  if (usePhone && await userStore.findByPhone(usePhone)) {
    return { success: false, error: '该手机号已注册' };
  }

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

  await userStore.create(user);

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
    user = await userStore.findByEmail(account);
  } else if (isPhone) {
    user = await userStore.findByPhone(account);
  } else {
    user = await userStore.findByNickname(account);
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
  const user = await userStore.findById(id);
  if (!user) return null;
  const { passwordHash: _, ...safeUser } = user;
  return safeUser;
}
