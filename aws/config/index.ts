import * as dotenv from 'dotenv';
import { EnvName } from '../typings/Config';
dotenv.config();
import { developmentConfig } from './develop';
import { productionConfig } from './production';
const NODE_ENV = process.env.NODE_ENV || EnvName.DEVELOPMENT;


export const getConfig = () => {
    if (NODE_ENV === EnvName.PRODUCTION) {
        return productionConfig;
    }
    return developmentConfig;
};