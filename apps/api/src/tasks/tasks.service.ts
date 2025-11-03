import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class TasksService {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateTaskDto) {
        return this.prisma.task.create({
            data: {
                title: dto.title,
                status: dto.status ?? 'TODO',
                dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
            },
        });
    }

    async findAll() {
        return this.prisma.task.findMany({ orderBy: { createdAt: 'desc' }});
    }

    async findOne(id: string) {
        const task = await this.prisma.task.findUnique({ where: {id}});
        if (!task) throw new NotFoundException('task not found');
        return task;
    }

    async update(id: string, dto: UpdateTaskDto) {
        await this.findOne(id);
        return this.prisma.task.update({
            where: { id },
            data: {
                ...(dto.title !== undefined ? { title: dto.title } :{}),
                ...(dto.status !== undefined ? { status: dto.status} : {}),
                ...(dto.dueDate !== undefined ? { dueDate: dto.dueDate ? new Date(dto.dueDate) : null } : {}),
            },
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        await this.prisma.task.delete({ where: { id } });
    }
}