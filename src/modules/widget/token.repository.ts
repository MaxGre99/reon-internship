import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from './token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TokenRepository {
    constructor(
        @InjectRepository(Token)
        private readonly repository: Repository<Token>
    ) {}

    public async upsert(accountId: string, subdomain: string, accessToken: string, refreshToken: string): Promise<void> {
        await this.repository.upsert({ accountId, subdomain, accessToken, refreshToken }, ['accountId']);
    }

    public async deleteByAccountId(accountId: string): Promise<void> {
        await this.repository.delete({ accountId });
    }
}
