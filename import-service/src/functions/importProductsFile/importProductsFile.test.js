import { getSignedUrl } from  "@aws-sdk/s3-request-presigner";
import { main as importProductsFile } from "./handler";

jest.mock('@aws-sdk/s3-request-presigner');
jest.mock('@aws-sdk/client-s3');

describe('importProductsFile', () => {
  const mockedGetSignedUrl = getSignedUrl;

  it('returns signedUrl sucessfully', async () => {
    const mockedSignedUrl = 'foo';
    mockedGetSignedUrl.mockResolvedValue(mockedSignedUrl);

    const expectedResponse = {
      statusCode: 200,
      body: mockedSignedUrl,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      }
    };

    const actualResponse = await importProductsFile({
      queryStringParameters: {
        name: 'bar',
      }
    });
  
    expect(actualResponse).toEqual(expectedResponse);
  });

  it('returns error if getSignedUrl fails', async () => {
    const mockedError = {
      message: 'something went wrong'
    }
    mockedGetSignedUrl.mockRejectedValue(mockedError);

    const expectedResponse = {
      statusCode: 500,
      error: mockedError.message,
    };

    const actualResponse = await importProductsFile({
      queryStringParameters: {
        name: 'bar',
      }
    });
  
    expect(actualResponse).toEqual(expectedResponse);
  });
});