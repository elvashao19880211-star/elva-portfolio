import { Redis } from '@upstash/redis';

// ============================================================
// 订单存储 - Upstash Redis (Vercel生产) + JSON 文件 (本地开发)
// ============================================================

export interface Order {
  outTradeNo: string;       // 商户订单号
  type: 'member' | 'pattern'; // 订单类型：会员 / 纹样作品
  planId: string;           // 商品 id（会员计划 id 或纹样 id）
  tier?: string;            // 档位（personal/commercial/source 等）
  title: string;            // 商品名
  amount: number;           // 金额（元）
  status: 'pending' | 'paid' | 'closed';
  userEmail?: string;
  createdAt: string;
  paidAt?: string;
}

const isProd = typeof process !== 'undefined' && !!process.env.UPSTASH_REDIS_REST_URL;

class JsonOrderStore {
  private orders: Order[] = [];

  async init() {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'data', 'orders.json');
      try {
        const data = await fs.readFile(filePath, 'utf-8');
        this.orders = JSON.parse(data);
      } catch {
        this.orders = [];
      }
    } catch {
      this.orders = [];
    }
  }

  private async save() {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'data', 'orders.json');
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(this.orders, null, 2), 'utf-8');
    } catch {}
  }

  async create(order: Order): Promise<void> {
    this.orders.push(order);
    await this.save();
  }
  async findByOutTradeNo(no: string): Promise<Order | null> {
    return this.orders.find((o) => o.outTradeNo === no) || null;
  }
  async markPaid(no: string): Promise<Order | null> {
    const o = this.orders.find((x) => x.outTradeNo === no);
    if (!o) return null;
    o.status = 'paid';
    o.paidAt = new Date().toISOString();
    await this.save();
    return o;
  }
}

class RedisOrderStore {
  private redis: Redis | null = null;

  private async getClient() {
    if (this.redis) return this.redis;
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
    return this.redis;
  }

  async create(order: Order): Promise<void> {
    const redis = await this.getClient();
    await redis.set(`order:${order.outTradeNo}`, JSON.stringify(order));
  }
  async findByOutTradeNo(no: string): Promise<Order | null> {
    try {
      const redis = await this.getClient();
      const data = await redis.get(`order:${no}`);
      if (!data) return null;
      if (typeof data === 'string') return JSON.parse(data) as Order;
      return data as Order;
    } catch {
      return null;
    }
  }
  async markPaid(no: string): Promise<Order | null> {
    const o = await this.findByOutTradeNo(no);
    if (!o) return null;
    o.status = 'paid';
    o.paidAt = new Date().toISOString();
    const redis = await this.getClient();
    await redis.set(`order:${no}`, JSON.stringify(o));
    return o;
  }
}

const store = isProd ? new RedisOrderStore() : new JsonOrderStore();

let initialized = false;
async function ensureInit() {
  if (initialized) return;
  if (store instanceof JsonOrderStore) await store.init();
  initialized = true;
}

export async function createOrder(order: Order): Promise<void> {
  await ensureInit();
  await store.create(order);
}

export async function getOrder(no: string): Promise<Order | null> {
  await ensureInit();
  return store.findByOutTradeNo(no);
}

export async function markOrderPaid(no: string): Promise<Order | null> {
  await ensureInit();
  return store.markPaid(no);
}
