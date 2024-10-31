import {Between, MoreThan,Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Admin} from "../admin/entity/admin.entity";
import {User} from "../user/entity/user.entity";

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(Admin)
        private readonly adminRepository: Repository<Admin>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    // Fetch all insights in a single method
    async getUserInsights(): Promise<any> {
        const totalUsers = await this.userRepository.count();

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const newUsers = await this.userRepository.count({
            where: {
                createdAt: MoreThan(yesterday),
            },
        });

        const activeUsers = await this.userRepository.count({
            where: {
                lastLogin: MoreThan(yesterday),
            },
        });

        const today = new Date();
        const pastWeekData: { date: string; count: number }[] = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);

            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const count = await this.userRepository.count({
                where: {
                    createdAt: Between(startOfDay, endOfDay),
                },
            });

            pastWeekData.push({
                date: startOfDay.toISOString().slice(0, 10), // Format as YYYY-MM-DD
                count,
            });
        }

        return {
            totalUsers,
            newUsers,
            activeUsers,
            userGrowth: pastWeekData,
        };
    }
}
