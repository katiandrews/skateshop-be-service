import getProductsById from '../functions/getProductsById';

describe('getProductsById', () => {
  it('returns product with id',async () => {
    const expectedResponse = {
      "count": 4,
      "description": "Pow Supply Co 8.25 Plant Blue Complete",
      "id": "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
      "price": 70,
      "title": "Element"
    };

    expect(await getProductsById({
      pathParameters: {
        productId: '7567ec4b-b10c-48c5-9345-fc73c48a80aa'
      }
    })).toStrictEqual(expectedResponse);
  });

  it('returns error if id not found',async () => {
    const expectedResponse = {
      error: 'Product not found',
    };

    expect(await getProductsById({
      pathParameters: {
        productId: 'foo'
      }
    })).toStrictEqual(expectedResponse);
  });
});