import { Stack, StackProps } from 'aws-cdk-lib';
import { InstanceClass, InstanceSize, InstanceType, NatProvider, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { NatType } from '../typings/Config';

export interface IVpcStackProps extends StackProps {
  natType: NatType;
}

export class VpcStack extends Stack {
  public readonly vpc: Vpc;
  constructor(scope: Construct, id: string, props: IVpcStackProps) {
    super(scope, id, props);

    // Validation
    const region: string | undefined = props.env?.region ?? undefined;
    if (!region) {
      throw new Error('Region is necessary')
    }

    // Vpc
    const vpcOptions: any = {
      maxAzs: 2,
      subnetConfiguration: [
        {
          name: `public`,
          subnetType: SubnetType.PUBLIC,
        },
        {
          name: `private`,
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
      ],
      natGateways: 1,
    };
    if (props.natType === NatType.NAT_GATEWAY) {
      vpcOptions.natGatewayProvider = NatProvider.gateway();
    } else {
      vpcOptions.natGatewayProvider = NatProvider.instance({
        instanceType: InstanceType.of(InstanceClass.T3A, InstanceSize.NANO),
      });
    }
    this.vpc = new Vpc(this, `${process.env.PROJECT_NAME}-vpc`, vpcOptions);
  }
}
