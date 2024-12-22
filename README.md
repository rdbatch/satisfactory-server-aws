# Satisfactory Server AWS
Automated Satisfactory Dedicated Server management on AWS

This repository was forked from [https://github.com/feydan/satisfactory-server-aws](https://github.com/feydan/satisfactory-server-aws). [Dan Fey](https://github.com/feydan) did a lot of excellent work getting the vast majority of this setup, I've just made some modifications for my own use plus updates along with the 1.0 release.

## Intro
FICSIT Incorporated has provided you with this tool (cost deducted from your existing balance) to assist you with Project Assembly.  This tool can help you collaborate with friends on your factory projects.

This project uses [AWS CDK](https://aws.amazon.com/cdk/) to provision everything you need to host a [Satisfactory Dedicated Server](https://satisfactory.fandom.com/wiki/Dedicated_servers) on AWS.  It includes the following:
 - VPC/Network configuration
 - Ec2 Instance provisioning
 - Automatic shutdown behavior when not in use (saves $$)
 - Automatic game file backup to s3
 - A Lambda browser endpoint to [start the server back up](#starting-the-server-back-up)

Why use AWS when you can host for free on your own computer?
 - If you want to allow friends to play on your server without you, you will have to always leave your computer on and the server running continuously, even if you are not playing.  Having it on the cloud frees up your hardware and prevents you from needing to open up your network to the internet.
 - Your computer may not have enough resources to host the server and play at the same time.

### Costs
I've configured this stack to use a significantly larger instance size to better support late game play. If you play on the server 2 hours per day, this setup will cost around $15/month on AWS using the currently set m7a.xlarge instance (plus up to $3.60/month for the Elastic IP). As Dedicated Server continues to mature, we may be to bring this down to a smaller instance without impacting late game performance, but this seems to be a sweet spot right now.

Since the server automatically shuts down when not in use, you only pay when the server is up and you (or your friends) are actively playing on it.

S3 and Lambda usage costs are free tier eligible.

### Disclaimers
This is a free and open source project and there are no guarantees that it will work or always continue working.  If you use it, you are responsible for maintaining your setup and monitoring and paying for your AWS bill.  It is a great project for learning a little AWS and CDK, but it is not so great if you wish to have a hands-off experience managing your game server.

## Requirements

- [AWS Account](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/)
- [Git](https://git-scm.com/downloads)
- [AWS Command Line Interface (cli)](https://aws.amazon.com/cli/)
- [NodeJs](https://nodejs.org/en/download/)

## Configuration

Copy the given `server-hosting/config.sample.ts` file to `server-hosting/config.ts` file. Fill the fields with appropriate values. Explanation for each field is given in file itself.

## Quick Start
This assumes you have all requirements and have [configured aws cli](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)

1. [Clone this project](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)
2. `npm install`
3. `npx cdk bootstrap <aws account number>/<aws region>` (only required if you don't already have CDK bootstrapped in your account/region pair)
4. `cp server-hosting/.config.sample.ts server-hosting/.config.ts` if you have not done so (see [Configuration](#configuration) for customization); you must fill in region and account
5. `npx cdk deploy`
6. Wait for the CloudFormation stack to finish. It may take a few minutes for the server to download/install everything after the stack is finished.
7. Use the Ec2 instance public IP address to connect to your server in Satisfactory Server Manager (see [DNS and IP management](#dns-and-ip-management))
8. Start a new game or upload a save

## Accessing your server

Access to the EC2 instance hosting your Satisfactory server can be done via [Session Manager](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/session-manager.html). External SSH is **blocked** by default at the network level.  Tip: ssm may open /bin/sh, running `bash` can get you to a more familiar bash shell.

The server has `bpytop` pre-installed for friendlier resource monitoring. Run `bpytop` while in Session Manager to open it, press "q" when you want to close it.

## DNS and IP management

This stack sets up a static Elastic IP address. This comes with some additional cost but has the benefit of remaining consistent every time the instance is restarted. The IP address will be listed as a stack output after deployment. If you want to avoid this cost, you can remove the Elastic IP and either lookup the address of the server on each boot or configure a dynamic DNS provider (+ agent on the instance itself).

## Starting the server back up
After deploying, there will be a Lambda setup with Api Gateway.  This provides a url that you (or your friends) can hit in any browser to start the server back up when you want to play.  To find this URL, navigate in AWS to API Gateway -> SatisfactoryHostingStartServerApi -> Dashboard (lefthand menu); the url is at the top next to "Invoke this API at:"