import { middyfy } from '@libs/lambda';
import { S3, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from  "@aws-sdk/s3-request-presigner";


const BUCKET_NAME = 'skate-shop-products';

const handler = async (event: { queryStringParameters: { name: string; }; }) => {
  const { name } = event.queryStringParameters;   

  const s3 = new S3({ region: 'eu-west-1' });
  const params = {
    Body: name,
    Bucket: BUCKET_NAME,
    Key: `uploaded/${name}`,
    ContentType: 'text/csv'
  };

  try {
    const putObjectCommand = new PutObjectCommand(params);

    const url = await getSignedUrl(s3, putObjectCommand, { expiresIn: 3600 });

    return {
      statusCode: 200,
      body: url,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      }
    };
  } catch (error) {
    return {
      statusCode: 500,
      error: error.message,
    };
  }
};

export const main = middyfy(handler);
