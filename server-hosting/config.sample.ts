export const Config = {
     // compulsory parameters

     // server hosting region, leave blank to use CDK_DEFAULT_REGION
     region: '',
     // server hosting account, leave blank to use CDK_DEFAULT_ACCOUNT
     account: '',
     // prefix for all resources in this app
     prefix: 'SatisfactoryHosting',
     // set to false if you don't want an api to
     // restart game server and true if you do
     restartApi: true,

     // optional parameters

     // bucket for storing save files
     // you can use an existing bucket
     // or leave it empty to create a new one
     bucketName: '',
     // server hosting vpc
     // Create a vpc and it's id here
     // or leave it empty to use default vpc
     vpcId: '',
     // specify server subnet
     // leave blank (preferred option) for auto-placement
     // If vpc is given specify subnet for that vpc
     // If vpc is not given specify subnet for default vpc
     subnetId: '',
     // Needed if subnetId is specified (i.e. us-west-2a)
     availabilityZone: ''
};
