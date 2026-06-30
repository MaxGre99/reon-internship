import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from './token.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../app/app.types';
import { AmoToken } from './widget.types';
import { Env } from '../../shared/enums/env.enum';
import axios from 'axios';

@Injectable()
export class WidgetService {
    constructor(
        @InjectRepository(Token)
        private readonly tokenRepository: Repository<Token>,
        private readonly configService: ConfigService<AppConfig>
    ) {}

    public async install(code: string, subdomain: string): Promise<void> {
        const rootPath = `https://${subdomain}.amocrm.ru`;

        const response = await axios.post<AmoToken>(`${rootPath}/oauth2/access_token`, {
            client_id: this.configService.get<string>(Env.ClientId),
            client_secret: this.configService.get<string>(Env.ClientSecret),
            grant_type: 'authorization_code',
            code,
            redirect_uri: this.configService.get<string>(Env.RedirectUri),
        });

        const payload = JSON.parse(Buffer.from(response.data.access_token.split('.')[1], 'base64').toString()) as {
            account_id: number;
        };

        const accountId = String(payload.account_id);

        await this.tokenRepository.upsert(
            {
                accountId,
                subdomain,
                accessToken: response.data.access_token,
                refreshToken: response.data.refresh_token,
            },
            ['accountId']
        );
    }

    public async remove(accountId: string): Promise<void> {
        await this.tokenRepository.delete({ accountId });
    }
}
