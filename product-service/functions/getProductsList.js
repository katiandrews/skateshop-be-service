import axios from "axios";

const getProductsList = async () => {
  try {
    const { data: products } = await axios.get('https://kb68k4fkw8.execute-api.eu-west-1.amazonaws.com/skates');

    return products;
    
  } catch (error) {
    return {
      statusCode: 500,
      body: error.message,
    }
  }
};

export default getProductsList;
