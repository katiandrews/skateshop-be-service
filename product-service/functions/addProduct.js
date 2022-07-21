import { Client } from 'pg';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;
const dbOptions = {
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000
};

const addProduct = async (event) => {
  console.log('New request started with payload', event);

  const client = new Client(dbOptions);
  await client.connect();

  const insertText = 'INSERT INTO products(title, description, price) VALUES($1, $2, $3)'

  try {
    if (!event.title || !event.description || !event.price) {
      return {
        statusCode: 400,
        error: 'Bad request',
      }
    }

    await client.query(
      insertText,
      [event.title, event.description, event.price]
    );
  
    // return {
    //   body: products,
    //   headers: {
    //     'Access-Control-Allow-Origin': '*',
    //     'Access-Control-Allow-Headers': '*',
    //   }
    // };
    
  } catch (error) {
    return {
      statusCode: 500,
      error: error.message,
    }
  } finally {
    client.end();
  }
};

export default addProduct;
