import { Stack, StackProps } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';

interface IStackProps extends StackProps {
    vpc: Vpc;
    baseDomain: string;
}

export class AlbStack extends Stack {
    public readonly httpsListener: elbv2.ApplicationListener;
    /**
     * Clients -> Load Balancer -> AWS Resource
     * Application Load Balancer components
     * [ Listener(Rule) -> Target Group(Health Check) -> Target ]
     */
    constructor(scope: Construct, id: string, props: IStackProps) {
        super(scope, id, props);
        const { vpc, baseDomain }: IStackProps = props;

        // Prerequisite: (AWS Console) Domain, Route53 hosted zone
        // Create a load balancer
        const applicationLoadBalancer: elbv2.ApplicationLoadBalancer = new elbv2.ApplicationLoadBalancer(this, 'alb', {
            vpc,
            internetFacing: true,
        });
        applicationLoadBalancer.addRedirect({
            sourceProtocol: elbv2.ApplicationProtocol.HTTP,
            sourcePort: 80,
            targetProtocol: elbv2.ApplicationProtocol.HTTPS,
            targetPort: 443,
        });


        // Create a target group
        const defaultTargetGroup: elbv2.IApplicationTargetGroup = new elbv2.ApplicationTargetGroup(this, `target-group`, {
            vpc,
            port: 80,
            healthCheck: {
                path: '/',
            },
        });

        // Add an https listener
        // No hosted zone error: You must reset cdk context and cdk synth
        // https://docs.aws.amazon.com/cdk/v2/guide/context.html
        const zone: route53.IHostedZone = route53.HostedZone.fromLookup(this, 'zone', { domainName: baseDomain });
        const wildardCertificate: Certificate = new Certificate(this, 'wildcard-certificate', {
            domainName: baseDomain,
            subjectAlternativeNames: [`*.${baseDomain}`],
            validation: CertificateValidation.fromDns(zone),
        });
        this.httpsListener = applicationLoadBalancer.addListener('listener', {
            protocol: elbv2.ApplicationProtocol.HTTPS,
            port: 443,
            certificates: [wildardCertificate],
            defaultTargetGroups: [defaultTargetGroup],
        })

        // (AWS Console) Add an record connected ALB to hosted zone in route53
    }
}