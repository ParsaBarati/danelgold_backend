import {Controller, Get} from '@nestjs/common';
import {ApiBearerAuth, ApiTags,} from '@nestjs/swagger';
import {DashboardService} from "./dashboard.service";


@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('Admin/dashboard')
export class DashboardController {
    constructor(
        private readonly dashboardService: DashboardService,
    ) {}

    @Get('/')
    async getUserInsights() {
        return await this.dashboardService.getUserInsights();
    }
}
