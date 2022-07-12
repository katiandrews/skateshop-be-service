import getProductsList from '../functions/getProductsList';
import productsData from '../productsData.json';

describe('getProductsList', () => {
  it('returns products list',async () => {
    expect(await getProductsList()).toStrictEqual({ ...productsData });
  })
});
