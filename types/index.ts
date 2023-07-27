import { StackProps } from 'aws-cdk-lib';

/**
 * Application Stack Props.
 * All are optional.
 */
export interface ApplicationStackProps extends StackProps {
    /**
     * Website Hostname
     * @default 'pwdcheck'
     */
    webHostname?: string,

    /** Route 53 Domain */
    zoneProps?: {
        /** The Zone Id from Route53 */
        hostedZoneId: string,
        /** The domain name */
        zoneName: string,
    },

    /** CloudFront certificate */
    cfCertArn?: string,
}
