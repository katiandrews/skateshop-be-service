import productsData from '../productsData.json';

const getProductsList = async () => {
  return {
    ...productsData,
  }
};

export default getProductsList;
