import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './token.entity';
import { AmoModule } from '../amo/amo.module';
import { WidgetService } from './widget.service';
import { TokenRepository } from './token.repository';
import { WidgetController } from './widget.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [TypeOrmModule.forFeature([Token]), AmoModule, JwtModule],
    providers: [WidgetService, TokenRepository],
    controllers: [WidgetController],
})
export class WidgetModule {}
