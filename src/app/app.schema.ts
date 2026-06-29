import * as Joi from 'joi';
import { Env } from '../shared/enums/env.enum';

export const appSchema = Joi.object({
    [Env.Port]: Joi.number().default(3000),
    [Env.ClientId]: Joi.string().required(),
    [Env.ClientSecret]: Joi.string().required(),
    [Env.AuthCode]: Joi.string().required(),
    [Env.RedirectUri]: Joi.string().required(),
    [Env.SubDomain]: Joi.string().required(),
});
