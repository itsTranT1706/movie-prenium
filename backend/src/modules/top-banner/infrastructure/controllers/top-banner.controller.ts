import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import {
    GetTopBannersUseCase,
    CreateTopBannerUseCase,
    UpdateTopBannerUseCase,
    DeleteTopBannerUseCase
} from '../../application';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards';
import { RolesGuard, Roles } from '@/modules/auth/infrastructure/guards';

@Controller('top-banners')
export class TopBannerController {
    constructor(
        private readonly getTopBannersUseCase: GetTopBannersUseCase,
        private readonly createTopBannerUseCase: CreateTopBannerUseCase,
        private readonly updateTopBannerUseCase: UpdateTopBannerUseCase,
        private readonly deleteTopBannerUseCase: DeleteTopBannerUseCase,
    ) { }

    // Public: Get all active banners
    @Get()
    async getTopBanners() {
        const result = await this.getTopBannersUseCase.execute({ activeOnly: true });

        if (result.isFailure) {
            return { success: false, error: result.error?.message };
        }

        return {
            success: true,
            data: result.value,
        };
    }

    // Admin: Get all banners (including inactive)
    @Get('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    async getAllBanners() {
        const result = await this.getTopBannersUseCase.execute({ activeOnly: false });

        if (result.isFailure) {
            return { success: false, error: result.error?.message };
        }

        return {
            success: true,
            data: result.value,
        };
    }

    // Admin: Create new banner
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    async createBanner(@Body() body: any) {
        const result = await this.createTopBannerUseCase.execute(body);

        if (result.isFailure) {
            return { success: false, error: result.error?.message };
        }

        return {
            success: true,
            data: result.value,
            message: 'Top banner created successfully',
        };
    }

    // Admin: Update banner
    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    async updateBanner(@Param('id') id: string, @Body() body: any) {
        const result = await this.updateTopBannerUseCase.execute({ id, ...body });

        if (result.isFailure) {
            return { success: false, error: result.error?.message };
        }

        return {
            success: true,
            data: result.value,
            message: 'Top banner updated successfully',
        };
    }

    // Admin: Delete banner
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    async deleteBanner(@Param('id') id: string) {
        const result = await this.deleteTopBannerUseCase.execute({ id });

        if (result.isFailure) {
            return { success: false, error: result.error?.message };
        }

        return {
            success: true,
            message: 'Top banner deleted successfully',
        };
    }
}
