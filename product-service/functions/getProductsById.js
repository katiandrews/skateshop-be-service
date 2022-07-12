import productsData from '../productsData.json';

const getProductsById = async (event) => {
  const { productId } = event.pathParameters;
  const product = productsData.find(el => el.id === productId);

  if (!product) {
    return {
      error: 'Product not found',
    }
  }

  return {
    ...product,
  }
};

export default getProductsById;
