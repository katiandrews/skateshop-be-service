import productsData from '../productsData.json';

const getProductsList = async (event, context, cb) => {
  try {
    cb(
      null,
      { ...productsData },
    );
  } catch (error) {
    cb(error);
  }
};

export default getProductsList;
