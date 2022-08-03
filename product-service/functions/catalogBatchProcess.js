import { SNSClient, PublishCommand } from "@aws-sdk/client-sns"
import axios from 'axios';

const CREATE_PRODUCT_URL = 'https://inf7uhotw1.execute-api.eu-west-1.amazonaws.com/products';

const catalogBatchProcess = async (event) => {
  try {
    const sns = new SNSClient({ region: 'eu-west-1' });

    for (let record of event.Records) {
      const newProduct = JSON.parse(record.body);
      console.log(newProduct);

      await axios.post(
        CREATE_PRODUCT_URL,
        {
          title: newProduct.title,
          description: newProduct.description,
          price: Number(newProduct.price),
        }
      );

      await sns.send(new PublishCommand({
        Subject: 'New products created',
        Message: JSON.stringify(newProduct),
        MessageAttributes: {
          price: {
            DataType: "Number", 
            StringValue: newProduct.price,
          }
        },
        TopicArn: process.env.PRODUCTS_SNS_ARN,
      }));
    }

    console.log('Email with new products has been sent');
    
    return {
      statusCode: 200,
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      error: error.message,
    }
  }

};

export default catalogBatchProcess;