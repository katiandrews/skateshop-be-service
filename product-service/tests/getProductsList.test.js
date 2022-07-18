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
});
