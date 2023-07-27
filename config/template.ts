import { ApplicationStackProps } from 'types';

export const options: ApplicationStackProps = {
    webHostname: '',
    zoneProps: {
        hostedZoneId: '',
        zoneName: '',
    },
    /** CloudFront certificate in us-east-1 */
    cfCertArn: '',
};
