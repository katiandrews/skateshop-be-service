import axios from "axios";

import catalogBatchProcess from '../functions/catalogBatchProcess';

const mockSnsSend = jest.fn();

jest.mock('axios');
jest.mock('@aws-sdk/client-sns', () => ({
  SNSClient: jest.fn(() => ({
    send: mockSnsSend
  })),
  PublishCommand: () => {
    return jest.fn().mockImplementation(function () {
    })
  }
})
);

describe('catalogBatchProcess', () => {
  const records = {
    Records: [
      {
        body: '{ "title": "foo", "description": "bar", "price": 10 }'
      }
    ],
  };
  const errorMessage = 'error';

  it('returns status code 200 on sucess',async () => {
    const mockAxiosPost = jest.fn().mockResolvedValue({});
    
    const successfulResponse = {
      statusCode: 200,
    };

    axios.post.mockImplementationOnce(mockAxiosPost);

    expect(await catalogBatchProcess(records)).toStrictEqual(successfulResponse);
    expect(mockAxiosPost).toHaveBeenCalledTimes(1);
    expect(mockSnsSend).toHaveBeenCalledTimes(1);
  });

  it('returns error if post products fails',async () => {
    const mockAxiosPost = jest.fn().mockRejectedValue({ message: errorMessage});

    const failedResponse = {
      statusCode: 500,
      error: errorMessage,
    };

    axios.post.mockImplementationOnce(mockAxiosPost);

    expect(await catalogBatchProcess(records)).toStrictEqual(failedResponse);
    expect(mockAxiosPost).toHaveBeenCalledTimes(1);
    expect(mockSnsSend).toHaveBeenCalledTimes(0);
  });

  it('returns error if sns send fails',async () => {
    const mockAxiosPost = jest.fn().mockResolvedValue({});

    const failedResponse = {
      statusCode: 500,
      error: errorMessage,
    };

    axios.post.mockImplementationOnce(mockAxiosPost);
    mockSnsSend.mockRejectedValue({ message: errorMessage });

    expect(await catalogBatchProcess(records)).toStrictEqual(failedResponse);
    expect(mockAxiosPost).toHaveBeenCalledTimes(1);
    expect(mockSnsSend).toHaveBeenCalledTimes(1);
  })
});
