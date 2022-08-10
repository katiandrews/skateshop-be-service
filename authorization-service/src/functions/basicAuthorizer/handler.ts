import { middyfy } from '@libs/lambda';


const hello = async (event) => {
  return {
    message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
    event,
  };
};

export const main = middyfy(hello);
