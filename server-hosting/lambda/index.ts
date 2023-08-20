import { EC2Client, StartInstancesCommand } from "@aws-sdk/client-ec2";
import * as s3 from "@aws-sdk/client-s3"
import * as s3Signer from "@aws-sdk/s3-request-presigner"

const bucketName = process.env.BUCKET_NAME
const s3Client = new s3.S3Client({ region: process.env.AWS_REGION })

const instanceId = process.env.INSTANCE_ID
const client = new EC2Client({ region: process.env.AWS_REGION });
const command = new StartInstancesCommand({ InstanceIds: [instanceId!] });

exports.handler = async function (event: any) {
  if (event.path.indexOf("latestsave") > -1) {
    console.log("Searching for latest save file in " + bucketName)

    const findLatestCommand = new s3.ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: "saves/"
    })

    const findLatestResponse = await s3Client.send(findLatestCommand)
    findLatestResponse.Contents?.sort((a,b) => b.LastModified!!.getTime() - a.LastModified!!.getTime())
    const latestSave = findLatestResponse.Contents![0]

    console.log("Found save: " + latestSave.Key)

    const getObjectCommand = new s3.GetObjectCommand({
      Bucket: bucketName,
      Key: latestSave.Key
    })
    const url = await s3Signer.getSignedUrl(s3Client, getObjectCommand)

    return {
      statusCode: 302,
      headers: {
        Location: url
      }
    }
  }
  else {
    console.log("Attempting to start game server", instanceId);

    return client.send(command)
      .then((res) => {
        console.log(JSON.stringify(res));
        return {
          statusCode: 200,
          headers: { "Content-Type": "text/json" },
          body: JSON.stringify({ message: "Started satisfactory server", response: JSON.stringify(res) })
        }
      })
      .catch((err) => {
        console.log(JSON.stringify(err));
        return {
          statusCode: 200,
          headers: { "Content-Type": "text/json" },
          body: JSON.stringify({ message: "Failed to start satisfactory server", response: JSON.stringify(err) })
        }
      });
  }
}
