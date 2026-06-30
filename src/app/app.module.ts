import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appSchema } from './app.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from './app.types';
import { Env } from '../shared/enums/env.enum';
import { WidgetModule } from '../modules/widget/widget.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: appSchema,
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService<AppConfig>) => ({
                type: 'postgres',
                host: configService.get<string>(Env.DbHost),
                port: configService.get<number>(Env.DbPort),
                username: configService.get<string>(Env.DbUser),
                password: configService.get<string>(Env.DbPassword),
                database: configService.get<string>(Env.DbName),
                autoLoadEntities: true,
                synchronize: true,
            }),
        }),
        WidgetModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
