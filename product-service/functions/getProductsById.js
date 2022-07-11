import productsData from '../productsData.json';

const getProductsById = (event, context, cb) => {
  const p = new Promise((resolve) => {
    resolve('success');
  });

  const { productId } = event.pathParameters;
  const product = productsData.find(el => el.id === productId);

  p.then(
    () => cb(
      null,
      {
        ...product,
      }
    )
  ).catch((e) => cb(e));
};

export default getProductsById;
