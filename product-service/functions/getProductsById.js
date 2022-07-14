import axios from "axios";

const getProductsById = async (event) => {
  const { productId } = event.pathParameters;

  try {
    const { data: productsData } = await axios.get('https://kb68k4fkw8.execute-api.eu-west-1.amazonaws.com/skates');
    const product = productsData.find(el => el.id === productId);

    if (!product) {
    return {
      error: 'Product not found',
    }
  }
    return {
      body: product,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      }
    }
    
  } catch (error) {
    return error;
  }
};

export default getProductsById;
