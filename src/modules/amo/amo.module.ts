import { Module } from '@nestjs/common';
import { AmoService } from './amo.service';

@Module({
    providers: [AmoService],
    exports: [AmoService],
})
export class AmoModule {}
