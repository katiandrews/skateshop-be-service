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

const getProductsList = async () => {
  console.log('New request started');
  const client = new Client(dbOptions);
  await client.connect();

  try {
    const { rows: products } = await client.query(`
      select id, title, description, price, count from products inner join stocks on id = product_id
    `);

    return {
      body: products,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      }
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      error: error.message,
    }
  } finally {
    client.end();
  }
};

export default getProductsList;
