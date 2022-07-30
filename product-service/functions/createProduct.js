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

const DEFAULT_COUNT = 20;

const createProduct = async (event) => {
  const { body } = event;
  console.log('New request started with payload', body);

  if (!body) {
    return {
      statusCode: 400,
      error: 'Bad request',
    }
  }

  const { title, description, price } = JSON.parse(body);

  const client = new Client(dbOptions);
  await client.connect();

  const insertProduct = 'INSERT INTO products(title, description, price) VALUES($1, $2, $3) RETURNING id'
  const insertStock = 'INSERT INTO stocks(product_id, count) VALUES($1, $2)'

  try {
    if (!title || !description || !price) {
      return {
        statusCode: 400,
        error: 'Bad request',
      }
    }

    try {
      await client.query('BEGIN');
      
      const { rows } = await client.query(
        insertProduct,
        [title, description, price],
      );

      const productId = rows[0].id;
      
      await client.query(
        insertStock,
        [`${productId}`, DEFAULT_COUNT],
      );

      await client.query('COMMIT');

      return {
        id: productId,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
        }
      };
    } catch (e) {
      await client.query('ROLLBACK')
      throw e;
    } finally {
      client.end();
    }
    
  } catch (error) {
    return {
      statusCode: 500,
      error: error.message,
    }
  }
};

export default createProduct;
