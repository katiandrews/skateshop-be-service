import { middyfy } from "@libs/lambda";
import { S3 } from "@aws-sdk/client-s3";
const CsvParser = require('csv-parser');

const handler = async (event) => {
  console.log('s3 object parsing has started...');

  const s3 = new S3({ region: 'eu-west-1' });

  try {
    for (let record of event.Records) {
      console.log(record);

      const objectKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));
      const { name: bucketName } = record.s3.bucket;

      const params = {
        Bucket: bucketName,
        Key: objectKey,
      };

      const newFile = await s3.getObject(params);

      await new Promise((res, rej) => {
        const result = [];
      
        newFile.Body
          .pipe(CsvParser())
          .on('data', (data) => result.push(data))
          .on('end', () => {
            console.log('File has been parsed successfully', result);
            res(result);
          })
          .on("error", (error) => {
            console.log("Error while parsing CSV file:", error);
            rej(error);
          });
      })

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
