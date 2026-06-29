import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from '../../shared/enums/env.enum';
import * as fs from 'fs';
import { AmoContact, AmoToken, AmoCustomField } from './amo.types';
import axios from 'axios';

const TOKEN_PATH = 'amo_token.json';

@Injectable()
export class AmoService {
    private readonly rootPath: string;

    private accessToken: string | null = null;

    private refreshToken: string | null = null;

    constructor(private readonly configService: ConfigService) {
        this.rootPath = `https://${this.configService.get<string>(Env.SubDomain)}.amocrm.ru`;
    }

    public async getAccessToken(): Promise<string> {
        if (this.accessToken) {
            return this.accessToken;
        }

        try {
            const content = fs.readFileSync(TOKEN_PATH, 'utf-8');
            const token = JSON.parse(content) as AmoToken;
            this.accessToken = token.access_token;
            this.refreshToken = token.refresh_token;
            return this.accessToken;
        } catch {
            return await this.requestAccessToken();
        }
    }

    private async requestAccessToken(): Promise<string> {
        const response = await axios.post<AmoToken>(`${this.rootPath}/oauth2/access_token`, {
            client_id: this.configService.get<string>(Env.ClientId),
            client_secret: this.configService.get<string>(Env.ClientSecret),
            grant_type: 'authorization_code',
            code: this.configService.get<string>(Env.AuthCode),
            redirect_uri: this.configService.get<string>(Env.RedirectUri),
        });
        const token = response.data;
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
        this.accessToken = token.access_token;
        this.refreshToken = token.refresh_token;
        return this.accessToken;
    }

    private async refreshAccessToken(): Promise<string> {
        const response = await axios.post<AmoToken>(`${this.rootPath}/oauth2/access_token`, {
            client_id: this.configService.get<string>(Env.ClientId),
            client_secret: this.configService.get<string>(Env.ClientSecret),
            grant_type: 'refresh_token',
            refresh_token: this.refreshToken,
            redirect_uri: this.configService.get<string>(Env.RedirectUri),
        });
        const token = response.data;
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
        this.accessToken = token.access_token;
        this.refreshToken = token.refresh_token;
        return this.accessToken;
    }

    public async getContact(id: number): Promise<AmoContact> {
        const token = await this.getAccessToken();

        const response = await axios.get<AmoContact>(`${this.rootPath}/api/v4/contacts/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    }

    public async updateContact(id: number, fields: AmoCustomField[]): Promise<void> {
        const token = await this.getAccessToken();

        await axios.patch(
            `${this.rootPath}/api/v4/contacts`,
            [
                {
                    id,
                    custom_fields_values: fields,
                },
            ],
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    }
}
