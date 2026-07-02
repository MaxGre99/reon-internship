import { Controller, Get, Query } from '@nestjs/common';
import { WidgetService } from './widget.service';
import type { InstallQuery, RemoveQuery } from './widget.types';
import { Endpoints } from '../../shared/constants/endpoints';

@Controller(Endpoints.Widget.Base)
export class WidgetController {
    constructor(private readonly widgetService: WidgetService) {}

    @Get(Endpoints.Widget.Install)
    public async install(@Query() query: InstallQuery): Promise<{ status: string }> {
        const { code, referer } = query;
        const subdomain = referer.replace('.amocrm.ru', '');
        void this.widgetService.install(code, subdomain).catch((err: unknown) => {
            console.error('Intsall error:', err);
        });
        return { status: 'ok' };
    }

    @Get(Endpoints.Widget.Remove)
    public async remove(@Query() query: RemoveQuery): Promise<{ status: string }> {
        void this.widgetService.remove(query.account_id).catch((err: unknown) => {
            console.error('Remove error:', err);
        });
        return { status: 'ok' };
    }
}
