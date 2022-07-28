import { middyfy } from '@libs/lambda';
import { S3, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from  "@aws-sdk/s3-request-presigner";


const BUCKET_NAME = 'skate-shop-products';

const handler = async (event: { queryStringParameters: { name: string; }; }) => {
  const { name } = event.queryStringParameters;   

  const s3 = new S3({ 
    region: 'eu-west-1',
    endpoint: 'https://s3-eu-west-1.amazonaws.com/',
  });

  const params = {
    Bucket: BUCKET_NAME,
    Key: `uploaded/${name}`,
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
