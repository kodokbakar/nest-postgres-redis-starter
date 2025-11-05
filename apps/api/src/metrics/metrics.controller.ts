
import { Controller, Get } from "@nestjs/common";
import { CacheService } from "src/cache/cache.service";

@Controller('metrics')
export class MetricsController {
    constructor(private readonly cache: CacheService) {}
    @Get('cache')
    async cacheMetrics() {
        return this.cache.metrics();
    }
}