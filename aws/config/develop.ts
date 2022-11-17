import * as dotenv from 'dotenv';
dotenv.config();
import { Config, EnvName, NatType } from '../typings/Config';

export const developmentConfig: Config = {
  env: {
    account: process.env.ACCOUNT ?? '',
    region: process.env.REGION ?? '',
    name: EnvName.DEVELOPMENT,
    prefix: `${EnvName.DEVELOPMENT}-`,
    projectName: process.env.PROJECT_NAME ?? '',
  },

  vpc: {
    natType: NatType.NAT_INSTANCE,
  },

  domain: {
    base: 'leoheojun.com',
  }
};