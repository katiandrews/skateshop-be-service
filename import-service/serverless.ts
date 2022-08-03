import type { AWS } from '@serverless/typescript';
import * as dotenv from "dotenv";

import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';

dotenv.config({path: __dirname + '/.env'});

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  useDotenv: true,
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Resource: 'arn:aws:s3:::skate-shop-products',
        Action: "s3:ListBucket",
      },
      {
        Effect: 'Allow',
        Resource: 'arn:aws:s3:::skate-shop-products/*',
        Action: "s3:*",
      },
      {
        Effect: 'Allow',
        Resource: 'arn:aws:sqs:eu-west-1:451720059886:catalogItemsQueue',
        Action: "sqs:SendMessage",
      },
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      SQS_QUEUE_URL: process.env.SQS_QUEUE_URL
    },
  },
  // import the function via paths
  functions: { 
    importProductsFile,
    importFileParser
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
