import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './token.entity';
import { WidgetService } from './widget.service';
import { WidgetController } from './widget.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Token])],
    providers: [WidgetService],
    controllers: [WidgetController],
})
export class WidgetModule {}
