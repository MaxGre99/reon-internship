import { Controller, Post, Body } from '@nestjs/common';
import { HookService } from './hook.service';

@Controller('hook')
export class HookController {
    constructor(private readonly hookService: HookService) {}

    @Post()
    public handleHook(@Body() body: unknown): { status: string } {
        void this.hookService.handleHook(body).catch((err: unknown) => {
            console.error('Hook error:', err);
        });
        return { status: 'ok' };
    }
}
