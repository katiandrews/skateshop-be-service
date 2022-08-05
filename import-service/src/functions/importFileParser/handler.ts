import { middyfy } from "@libs/lambda";
import { S3 } from "@aws-sdk/client-s3";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { NewProduct } from "src/types/products";
const CsvParser = require('csv-parser');

const handler = async (event) => {
  console.log('s3 object parsing has started...');

  const s3 = new S3({ region: 'eu-west-1' });
  const sqs = new SQSClient({ region: 'eu-west-1' });

  try {
    for (let record of event.Records) {
      console.log(record);

      const objectKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));
      const { name: bucketName } = record.s3.bucket;

      const params = {
        Bucket: bucketName,
        Key: objectKey,
      };

      const newProduct = await s3.getObject(params);

      const parsedProducts: NewProduct[] = await new Promise((res, rej) => {
        const result = [];
      
        newProduct.Body
          .pipe(CsvParser())
          .on('data', (data) => result.push(data))
          .on('end', () => {
            res(result);
          })
          .on("error", (error) => {
            console.log("Error while parsing CSV file:", error);
            rej(error);
          });
      })

      parsedProducts.forEach(async (product) => {
        await sqs.send(new SendMessageCommand({
          MessageBody: JSON.stringify(product),
          QueueUrl: process.env.SQS_QUEUE_URL,
        }));
      });

      const copyObjectParams = {
        Bucket: bucketName, 
        CopySource: encodeURIComponent(`${bucketName}/${objectKey}`),
        Key: objectKey.replace('uploaded', 'parsed'),
      };
      await s3.copyObject(copyObjectParams);

      const deleteObjectParams = {
        Bucket: bucketName,
        Key: objectKey
      }
      await s3.deleteObject(deleteObjectParams);

      console.log('Copied object to parsed folder');
      
    };

    return {
      statusCode: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      error: error.message,
    };
  }
};

export const main = middyfy(handler);
