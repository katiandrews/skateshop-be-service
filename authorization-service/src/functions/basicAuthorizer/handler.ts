import { middyfy } from '@libs/lambda';

const handler = async (event) => {
  if(event.type != 'TOKEN') {
    return {
      statusCode: 401,
      error: 'Unauthorized',
    }
  }

  try {
    const encodedToken = event.authorizationToken.split(' ')[1];
    const buff = Buffer.from(encodedToken, 'base64');
    const decodedCreds = buff.toString('utf-8').split(':');
    const username = decodedCreds[0];
    const password = decodedCreds[1];

    console.log(`username: ${username} and password: ${password}`);

    const storedUserPassword = process.env[username];

    const effect = !storedUserPassword || storedUserPassword !== password ? 'Deny' : 'Allow';

    return generatePolicy(encodedToken, event.methodArn, effect);
    
  } catch (error) {
    return {
      statusCode: 403,
      error: error.message,
    }
  }
};

const generatePolicy = (principalId, resource, effect) => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource,
      }]
    }
  }
};

export const main = middyfy(handler);
