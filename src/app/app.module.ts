import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { appSchema } from './app.schema';
import { HookModule } from '../modules/hook/hook.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: appSchema,
        }),
        HookModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
