import productsData from '../productsData.json';

const getProductsById = (event, context, cb) => {
  const { productId } = event.pathParameters;
  const product = productsData.find(el => el.id === productId);

  if (!product) {
    cb(
      null,
      { error: 'Product not found' },
    );
  }

  cb(
    null,
    { ...product },
  )
};

export default getProductsById;
