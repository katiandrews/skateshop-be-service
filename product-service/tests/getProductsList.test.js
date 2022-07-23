import axios from "axios";

import getProductsList from '../functions/getProductsList';

jest.mock('axios');

describe('getProductsList', () => {
  it('returns products list',async () => {
    const mockedProducts = [{ foo: 'bar'}];

    axios.get.mockResolvedValueOnce({
      data: mockedProducts,
    });

    expect(await getProductsList()).toStrictEqual({
      body: mockedProducts,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
    });
  })

  it('returns error if products request fails',async () => {
    const mockedErrorMessage = 'foo';

    axios.get.mockRejectedValueOnce({
      message: mockedErrorMessage,
    })

    expect(await getProductsList()).toStrictEqual({
      statusCode: 500,
      error: mockedErrorMessage,
    });
  })
});
