import {
    CfnOutput, RemovalPolicy, Stack,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApplicationStackProps } from 'types';
import {
    ARecord, HostedZone, IHostedZone, RecordTarget,
} from 'aws-cdk-lib/aws-route53';
import { Certificate, CertificateValidation, ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import {
    AllowedMethods,
    CachePolicy,
    Distribution, HttpVersion, OriginAccessIdentity, SecurityPolicyProtocol,
    ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';

/**
 * Deploys the application including website and CloudFront distribution
 */
export class ApplicationStack extends Stack {
    private zone?: IHostedZone;

    private webCert?: ICertificate | Certificate;

    /**
     * @param {Construct} scope
     * @param {string} id
     * @param {ApplicationStackProps} props
     */
    constructor(scope: Construct, id: string, props: ApplicationStackProps) {
        super(scope, id, props);

        const {
            zoneProps,
            cfCertArn,
        } = props;
        const webHostname = props.webHostname || 'pwdcheck';

        // Optional DNS and Root API Domain ==================
        if (zoneProps) {
            const { zoneName } = zoneProps;
            const zone = HostedZone.fromHostedZoneAttributes(this, 'Zone', zoneProps);
            this.zone = zone;

            /**
             * Import CloudFront certificate for website custom domain
             * CloudFront Certificate must be in us-east-1. If the stack is deployed in that region
             * then we will create the certificate if required.
             * Creating the certificate is more complicated if deploying the application stack
             * in a different region - out of scope for this example.
             */
            this.webCert = (cfCertArn) ? Certificate.fromCertificateArn(this, 'WebCert', cfCertArn) : undefined;
            if (!this.webCert && this.region === 'us-east-1') {
                this.webCert = new Certificate(this, 'WebCert', {
                    domainName: `*.${zoneName}`,
                    validation: CertificateValidation.fromDns(zone),
                });
            }
        }

        // Web =====================================

        // S3 web bucket for web site
        const webBucket = new Bucket(this, 'WebBucket', {
            versioned: false,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });

        // CloudFront web distribution
        const webDist = new Distribution(this, 'WebDist', {
            defaultBehavior: {
                origin: S3BucketOrigin.withOriginAccessControl(webBucket),
                cachePolicy: CachePolicy.CACHING_OPTIMIZED,
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
            },
            defaultRootObject: 'index.html',
            certificate: this.webCert,
            domainNames: this.zone ? [`${webHostname}.${this.zone.zoneName}`] : undefined,
            minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
            httpVersion: HttpVersion.HTTP2_AND_3,
        });
        const cfDomain = webDist.distributionDomainName;

        // Output the CloudFront endpoint
        new CfnOutput(this, 'CloudFrontEndpoint', {
            description: 'CloudFront endpoint URL',
            value: `https://${cfDomain}`
        });

        // Deploy the web files
        new BucketDeployment(this, 'WebSite', {
            sources: [Source.asset(`${__dirname}/../web/dist`)],
            destinationBucket: webBucket,
            // invalidate the cache on deploying new web assets:
            distribution: webDist,
            distributionPaths: ['/*'],
        });

        // Create DNS Alias
        if (this.zone) {
            new ARecord(this, 'WebAlias', {
                target: RecordTarget.fromAlias(new CloudFrontTarget(webDist)),
                zone: this.zone,
                recordName: `${webHostname}.${this.zone.zoneName}`,
            });
            // Output the custom endpoint
            new CfnOutput(this, 'CustomEndpoint', {
                description: 'Custom domain endpoint URL',
                value: `https://${webHostname}.${this.zone.zoneName}`,
            });
        }
    }
}
