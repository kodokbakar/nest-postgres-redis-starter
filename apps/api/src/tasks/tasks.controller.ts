import { Body, Controller,Delete, Get, HttpCode, Param, Patch, Post } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasks: TasksService) {}

    @Post()
    create(@Body() dto: CreateTaskDto) {
        return this.tasks.create(dto);
    }

    @Get()
    findAll() {
        return this.tasks.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.tasks.findOne(id);
    }

    @Patch(":id")
    update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
        return this.tasks.update(id, dto);
    }

    @Delete(":id")
    @HttpCode(204)
    async remove(@Param('id') id: string) {
        await this.tasks.remove(id);
    }
}