import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { CacheService } from "../cache/cache.service";

@Injectable()
export class TasksService {
    constructor(private readonly prisma: PrismaService, private readonly cache: CacheService) {}

    private taskKey(id: string) { return `task:${id}`; }
    private listKey() { return `tasks:list:all`; }

    async create(dto: CreateTaskDto) {
        const created = await this.prisma.task.create({
            data: {
                title: dto.title,
                status: dto.status ?? 'TODO',
                dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
            },
        });

        await this.cache.delPattern('tasks:list:*');
        await this.cache.setJSON(this.taskKey(created.id), created, this.cache.taskItemTTL());
        return created;
    }

    async findAll() {
        const key = this.listKey();
        const ttl = this.cache.taskListTTL();

        const value = await this.cache.getOrSetJSON(key, ttl, async () => {
            const rows = await this.prisma.task.findMany({ orderBy: { createdAt: 'desc' } });
            return rows;
        });
        return value!;
    }

    async findOne(id: string) {
        const key = this.taskKey(id);
        const ttl = this.cache.taskItemTTL();

        const item = await this.cache.getOrSetJSON(key, ttl, async () => {
            return await this.prisma.task.findUnique({ where: { id } });
        });

        if (!item) throw new NotFoundException('task not found');
        return item;
    }

    async update(id: string, dto: UpdateTaskDto) {
        await this.findOne(id);
        const updated = await this.prisma.task.update({
            where: { id },
            data: {
                ...(dto.title !== undefined ? { title: dto.title } :{}),
                ...(dto.status !== undefined ? { status: dto.status} : {}),
                ...(dto.dueDate !== undefined ? { dueDate: dto.dueDate ? new Date(dto.dueDate) : null } : {}),
            },
        });

        await this.cache.del(this.taskKey(id));
        await this.cache.delPattern('tasks:list:*');
        return updated;
    }

    async remove(id: string) {
        await this.findOne(id);
        await this.prisma.task.delete({ where: { id } });
        await this.cache.del(this.taskKey(id));
        await this.cache.delPattern('tasks:list:*');
    }
}