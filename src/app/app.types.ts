import { Env } from '../shared/enums/env.enum';

export type AppConfig = {
    [Env.Port]: number;
    [Env.ClientId]: string;
    [Env.ClientSecret]: string;
    [Env.AuthCode]: string;
    [Env.RedirectUri]: string;
    [Env.SubDomain]: string;
};
