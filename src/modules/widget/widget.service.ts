import { Injectable } from '@nestjs/common';
import { AmoService } from '../amo/amo.service';
import { TokenRepository } from './token.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WidgetService {
    constructor(
        private readonly amoService: AmoService,
        private readonly tokenRepository: TokenRepository,
        private readonly jwtService: JwtService
    ) {}

    public async install(code: string, subdomain: string): Promise<void> {
        const token = await this.amoService.getToken(code, subdomain);

        const payload = this.jwtService.decode<{ account_id: number }>(token.access_token);
        const accountId = String(payload.account_id);

        await this.tokenRepository.upsert(accountId, subdomain, token.access_token, token.refresh_token);
    }

    public async remove(accountId: string): Promise<void> {
        await this.tokenRepository.deleteByAccountId(accountId);
    }
}
