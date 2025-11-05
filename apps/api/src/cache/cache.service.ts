import { Injectable,OnModuleDestroy } from "@nestjs/common";
import Redis from 'ioredis';
import crypto from 'node:crypto';

type Json = Record<string, any> | any[];

@Injectable()
export class CacheService implements OnModuleDestroy {
    private client: Redis;
    private readonly hitsKey = 'metrics:cache:hits';
    private readonly missesKey = 'metrics:cache:misses';
    private readonly itemTTL = Number(process.env.CACHE_TASK_ITEM_TTL || 60);
    private readonly listTTL = Number(process.env.CACHE_TASK_LIST_TTL || 30);

    constructor() {
        const url = process.env.REDIS_URL ?? 'redis://localhost:6379';
        this.client = new Redis(url, {lazyConnect: false });
    }

    hash(obj: unknown): string {
        const s = JSON.stringify(obj ?? {});
        return crypto.createHash('sha1').update(s).digest('hex').slice(0, 16);
    }

    async getJSON<T = Json>(key: string): Promise<T | null> {
        const raw = await this.client.get(key);
        if (!raw) return null;
        await this.client.incr(this.hitsKey);
        return JSON.parse(raw) as T;
    }

    async setJSON(key: string, value: Json, ttlSec: number): Promise<void> {
        await this.client.set(key, JSON.stringify(value), 'EX', ttlSec);
    }

    async del(key: string): Promise<void> {
        await this.client.del(key);
    }

    async delPattern(pattern: string): Promise<number> {
        let cursor = '0';
        let total = 0;
        do {
            const [next, keys] = await this.client.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
            cursor = next;
            if (keys.length) total += await this.client.del(...keys);
        } while (cursor !== '0');
        return total;
    }

    async getOrSetJSON<T>(
        key: string,
        ttlSec: number,
        fetcher: () => Promise<T | null>,
    ): Promise<T | null> {
        const cached = await this.client.get(key);
        if (cached) {
            await this.client.incr(this.hitsKey);
            return JSON.parse(cached) as T;
        }
        await this.client.incr(this.missesKey);
        const value = await fetcher();
        if (value !== null && value !== undefined) {
            await this.setJSON(key, value as Json, ttlSec);
        }
        return value ?? null;
    }

    taskItemTTL() {return this.itemTTL; }
    taskListTTL() {return this.listTTL; }

    async metrics() {
        const [hitsRaw, missesRaw] = await this.client.mget(this.hitsKey, this.missesKey);
        const hits = Number(hitsRaw || 0);
        const misses = Number(missesRaw || 0);
        const total = hits + misses;
        return {
            hits, misses, total,
            hitRate: total ? Number((hits / total).toFixed(4)) : 0,
            ttl: { item: this.itemTTL, list: this.listTTL },
        };
    }

    async onModuleDestroy() {
        await this.client.quit()
    }
}