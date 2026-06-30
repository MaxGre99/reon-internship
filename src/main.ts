import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { Env } from './shared/enums/env.enum';
import { AppConfig } from './app/app.types';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService<AppConfig>);
    const port = configService.get<number>(Env.Port) ?? 3000;
    await app.listen(port);
}

void bootstrap();
