export enum NatType {
  NAT_INSTANCE = 'NAT_INSTANCE',
  NAT_GATEWAY = 'NAT_GATEWAY',
}

export enum EnvName {
  DEVELOPMENT = 'dev',
  STAGING = 'stg',
  PRODUCTION = 'prod',
}

export interface Config {
  env: {
    name: string;
    prefix: string;
    account: string;
    region: string;
    projectName: string;
  };

  vpc: {
    natType: NatType;
  };
}