import { Module } from '@nestjs/common';
import { HookService } from './hook.service';
import { HookController } from './hook.controller';
import { AmoModule } from '../amo/amo.module';

@Module({
    imports: [AmoModule],
    providers: [HookService],
    controllers: [HookController],
})
export class HookModule {}
