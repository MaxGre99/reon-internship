import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from '../../shared/enums/env.enum';
import * as fs from 'fs';
import { AmoContact, AmoToken, AmoDeal, AmoTask } from './amo.types';
import axios from 'axios';
import { AppConfig } from '../../app/app.types';

const TOKEN_PATH = 'amo_token.json';

@Injectable()
export class AmoService {
    private readonly rootPath: string;

    private accessToken: string | null = null;

    private refreshToken: string | null = null;

    constructor(private readonly configService: ConfigService<AppConfig>) {
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

    private async withAuth<T>(request: (token: string) => Promise<T>): Promise<T> {
        const token = await this.getAccessToken();
        try {
            return await request(token);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                this.accessToken = null;
                const newToken = await this.refreshAccessToken();
                return await request(newToken);
            }
            if (axios.isAxiosError(error) && error.response?.status === 429) {
                await new Promise<void>((resolve) => setTimeout(resolve, 1000));
                return await request(token);
            }
            throw error;
        }
    }

    public async getContact(id: number): Promise<AmoContact> {
        return this.withAuth((token) =>
            axios
                .get<AmoContact>(`${this.rootPath}/api/v4/contacts/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => res.data)
        );
    }

    public async getDeal(id: number): Promise<AmoDeal> {
        return this.withAuth((token) =>
            axios
                .get<AmoDeal>(`${this.rootPath}/api/v4/leads/${id}?with=contacts`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => res.data)
        );
    }

    public async updateDealBudget(id: number, budget: number): Promise<void> {
        return this.withAuth((token) =>
            axios
                .patch(`${this.rootPath}/api/v4/leads`, [{ id, price: budget }], {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(() => undefined)
        );
    }

    public async getDealTasks(dealId: number): Promise<AmoTask[]> {
        return this.withAuth((token) =>
            axios
                .get<{
                    _embedded: { tasks: AmoTask[] };
                }>(`${this.rootPath}/api/v4/tasks?filter[entity_type]=leads&filter[entity_id][]=${dealId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => res.data._embedded?.tasks ?? [])
        );
    }

    public async createTask(dealId: number, taskTypeId: number, text: string): Promise<void> {
        const deadline = Math.floor(Date.now() / 1000) + 86400;
        return this.withAuth((token) =>
            axios
                .post(
                    `${this.rootPath}/api/v4/tasks`,
                    [{ entity_type: 'leads', entity_id: dealId, task_type_id: taskTypeId, text, complete_till: deadline }],
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then(() => undefined)
        );
    }

    public async createDealNote(dealId: number, text: string): Promise<void> {
        return this.withAuth((token) =>
            axios
                .post(`${this.rootPath}/api/v4/leads/${dealId}/notes`, [{ note_type: 'common', params: { text } }], {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(() => undefined)
        );
    }
}
