import * as dotenv from 'dotenv';
dotenv.config();
import { Config, EnvName, NatType } from '../typings/Config';

export const productionConfig: Config = {
    env: {
        account: process.env.ACCOUNT ?? '',
        region: process.env.REGION ?? '',
        name: EnvName.PRODUCTION,
        prefix: `${EnvName.PRODUCTION}-`,
        projectName: process.env.PROJECT_NAME ?? '',
    },

    vpc: {
        natType: NatType.NAT_GATEWAY,
    },

    domain: {
        base: 'leoheojun.com',
    }
}