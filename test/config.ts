import * as dotenv from 'dotenv';
import * as path from 'path';
import { IntegrationConfig } from '../src/config';

if (process.env.LOAD_ENV) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}
const DEFAULT_API_USER = 'dummy-sigsci-api-user';
const DEFAULT_API_TOKEN = 'dummy-sigsci-api-token';

export const integrationConfig: IntegrationConfig = {
  apiUser: process.env.API_USER || DEFAULT_API_USER,
  apiToken: process.env.API_TOKEN || DEFAULT_API_TOKEN,
};
