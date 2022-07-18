import axios from "axios";

import getProductsById from '../functions/getProductsById';

jest.mock('axios');

describe('getProductsById', () => {
  const mockedProductId = 'qwe';
  const mockedProducts = [{
    foo: 'bar',
    id: mockedProductId,
  }];

  beforeEach(() => {
    axios.get.mockResolvedValueOnce({
      data: mockedProducts,
    });
  });

  it('returns product with id',async () => {
    const expectedResponse = {
      body: {
        foo: 'bar',
        id: mockedProductId,
      },
      headers: {
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
      },
    };

    expect(await getProductsById({
      pathParameters: {
        productId: mockedProductId
      }
    })).toStrictEqual(expectedResponse);
  });

  it('returns error if id not found',async () => {
    const expectedResponse = {
      statusCode: 400,
      error: 'Product not found',
    };

    expect(await getProductsById({
      pathParameters: {
        productId: 'foo'
      }
    })).toStrictEqual(expectedResponse);
  });
});