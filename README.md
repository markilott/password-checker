# Will I Be Pwned? A Password Strength Checker Demo

This project creates a basic web site that completes a check of passwords to determine strength.

AWS CDK is used to deploy a static site to S3, fronted by a CloudFront distribution.

For details on the concept and purpose check out the [Medium article](https://markilott.medium.com/how-most-password-policies-make-us-less-secure-69476ca9fe92).

In a nutshell, the site is designed to demonstrate:
- the use of common password lookups from [Have I Been Pwned](https://haveibeenpwned.com/API/v2)
- password strength checking using [zxcvbn](https://www.npmjs.com/package/zxcvbn)
- how typical complexity checks can give you a false sense of security

Note this is definitely not production ready code! In particular, the zxcvbn module is not optimised for web distribution (because I'm definitely not a front-end dev).

&nbsp;

## Deployment

You can easily deploy the site yourself if keen.

**Note the local build scripts use Bash. On Windows you will need to use GitBash or WSL or similar to build the project.**

Requirements:

- Install and configure [AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html) and the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) locally
- CDK Bootstrap your AWS environment (covered in the AWS CDK link above)
- From the root of the project: `npm ci` and then `npm run build`
- By default the site will deploy without a custom domain. The CloudFront endpoint will be used for the web site. If you have your own domain in Route53 skip to Customising the Deployment.
- To deploy with the default endpoint to your default environment: `cdk deploy`

The endpoint URL will be output in the CLI and in CloudFormation in the console.

To customise using your own Route53 Domain edit the `config/local.ts` file (created when you run `npm run build`)

&nbsp;

## Costs and Cleanup

The resources created are well within the AWS free tier and there is no cost to the deployment or application. It does create a public web site by default however so you should clean it up when done to avoid any nasty surprises.

When you are done simply run `cdk destroy` to delete the whole application and site.
