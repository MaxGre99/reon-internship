import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../app/app.types';
import type { AmoToken } from '../widget/widget.types';
import axios from 'axios';
import { Env } from '../../shared/enums/env.enum';

@Injectable()
export class AmoService {
    constructor(private readonly configService: ConfigService<AppConfig>) {}

    public async getToken(code: string, subdomain: string): Promise<AmoToken> {
        const response = await axios.post<AmoToken>(`https://${subdomain}.amocrm.ru/oauth2/access_token`, {
            client_id: this.configService.get<string>(Env.ClientId),
            client_secret: this.configService.get<string>(Env.ClientSecret),
            grant_type: 'authorization_code',
            code,
            redirect_uri: this.configService.get<string>(Env.RedirectUri),
        });

        return response.data;
    }
}
