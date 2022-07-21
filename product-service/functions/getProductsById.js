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

const getProductsById = async (event) => {
  const { productId } = event.pathParameters;
  console.log('New request with parameter productId', productId);

  const client = new Client(dbOptions);
  await client.connect();

  try {
    const { rows: product } = await client.query(`
      select id, title, description, price, count from products 
      inner join stocks on id = product_id
      where id = '${productId}'
    `);

    if (!product[0]) {
    return {
      statusCode: 400,
      error: 'Product not found',
    }
  }
    return {
      body: product[0],
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      }
    }
    
  } catch (error) {
    return {
      statusCode: 500,
      error: error.message,
    };
  } finally {
    client.end();
  }
};

export default getProductsById;
