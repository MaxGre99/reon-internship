import { Controller, Get, Query } from '@nestjs/common';
import { WidgetService } from './widget.service';
import type { InstallQuery, RemoveQuery } from './widget.types';

@Controller('widget')
export class WidgetController {
    constructor(private readonly widgetService: WidgetService) {}

    @Get('install')
    public async install(@Query() query: InstallQuery): Promise<{ status: string }> {
        // console.log('Widget install query:', query);
        const { code, referer } = query;
        const subdomain = referer.replace('.amocrm.ru', '');
        void this.widgetService.install(code, subdomain).catch((err: unknown) => {
            console.error('Intsall error:', err);
        });
        return { status: 'ok' };
    }

    @Get('remove')
    public async remove(@Query() query: RemoveQuery): Promise<{ status: string }> {
        // console.log('Widget remove query:', query);
        void this.widgetService.remove(query.account_id).catch((err: unknown) => {
            console.error('Remove error:', err);
        });
        return { status: 'ok' };
    }
}
