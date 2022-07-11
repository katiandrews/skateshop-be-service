import productsData from '../productsData.json';

const getProductsList = async (event, context, cb) => {
  const p = new Promise((resolve) => {
    resolve('success');
  });

  p.then(() =>
    cb(
      null,
      {
        ...productsData,
      }
    )
  ).catch((e) => cb(e));
};

export default getProductsList;
