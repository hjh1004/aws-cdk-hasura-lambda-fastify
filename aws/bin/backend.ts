import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { VpcStack } from '../lib/vpc';
import { getConfig } from '../config';
import { Config } from '../typings/Config';


const getIdWithPrefix = (config: Config) => (stackName: string) => {
    return `${config.env.prefix}${config.env.projectName}-${stackName}`;
}
const config = getConfig();
const getStackId = getIdWithPrefix(config);

const app = new App();

const vpc = new VpcStack(app, getStackId('vpc'), {
    env: config.env,
    natType: config.vpc.natType
});
