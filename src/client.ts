import https from 'https';

import {
  IntegrationProviderAuthenticationError,
  IntegrationError,
  IntegrationProviderAPIError,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from './config';
import { SignalSciencesUser, SignalSciencesCorp } from './types';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

const BASE_URI = 'https://dashboard.signalsciences.net/api/v0';

/**
 * An APIClient maintains authentication state and provides an interface to
 * third party data APIs.
 *
 * It is recommended that integrations wrap provider data APIs to provide a
 * place to handle error responses and implement common patterns for iterating
 * resources.
 */
export class APIClient {
  constructor(readonly config: IntegrationConfig) {}

  public async verifyAuthentication(): Promise<void> {
    const endpoint = `${BASE_URI}/corps`;

    await this.getJson(endpoint, {
      headers: this.generateHeaders(),
    }).catch((error) => {
      if (error.statusCode === 401) {
        throw new IntegrationProviderAuthenticationError({
          cause: error,
          endpoint,
          status: error.status,
          statusText: error.statusText,
        });
      } else {
        throw new IntegrationProviderAPIError({
          cause: error,
          endpoint,
          status: error.status,
          statusText: error.statusText,
        });
      }
    });
  }

  /**
   * Iterates each corp resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationship
   */
  public async iterateCorps(
    iteratee: ResourceIteratee<SignalSciencesCorp>,
  ): Promise<void> {
    const endpoint = `${BASE_URI}/corps`;

    const { data } = await this.getJsonWithRetries(endpoint, {
      headers: this.generateHeaders(),
    });

    for (const corp of data) {
      await iteratee(corp);
    }
  }

  /**
   * Iterates each user resource in the provider based on the provided corp.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateUsers(
    corpName: string,
    iteratee: ResourceIteratee<SignalSciencesUser>,
  ): Promise<void> {
    const endpoint = this.buildEndpoint(corpName, '/users');

    const { data } = await this.getJsonWithRetries(endpoint, {
      headers: this.generateHeaders(),
    });

    for (const user of data) {
      await iteratee(user);
    }
  }

  private buildEndpoint(corp: string, path?: string) {
    if (!corp) {
      throw new IntegrationError({
        message: `Parameter 'corp' is required, but received ${corp}`,
        code: 'INVALID_PARAM_ERROR',
      });
    }

    if (path) {
      return `${BASE_URI}/corps/${corp}${path}`;
    } else {
      return `${BASE_URI}/corps/${corp}`;
    }
  }

  private generateHeaders() {
    const { apiUser, apiToken } = this.config;

    return {
      'x-api-user': apiUser,
      'x-api-token': apiToken,
      'Content-Type': 'application/json',
    };
  }

  private async getJsonWithRetries(endpoint, options, retries = 0) {
    try {
      return await this.getJson(endpoint, options);
    } catch (error) {
      if ([429, 503, 504].includes(error.status) && retries < 5) {
        // TODO: add delay before retry (sp - 1/2022)
        return await this.getJsonWithRetries(endpoint, options, ++retries);
      } else {
        console.error(error);

        throw new IntegrationProviderAPIError({
          cause: error,
          endpoint,
          status: error.status,
          statusText: error.statusText,
        });
      }
    }
  }

  /**
   * Uses nodejs https.get method to make HTTTP requests.
   * Parses JSON result, returning the data.
   * @param endpoint
   * @param options
   * @returns Promise
   */
  private getJson(
    endpoint: string,
    options: https.RequestOptions,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let dataString = '';

      const request = https.get(endpoint, options, (response) => {
        response.on('error', (error) => {
          reject({
            status: 500,
            statusText: error.message,
          });
        });

        response.on('data', (chunk: string) => {
          dataString += chunk;
        });

        response.on('end', () => {
          if (response.statusCode === 200) {
            resolve({
              status: 200,
              data: dataString ? JSON.parse(dataString)?.data : null,
            });
          } else {
            reject({
              status: response.statusCode,
              statusText: dataString
                ? JSON.parse(dataString)?.message
                : 'An error occurred.',
            });
          }
        });
      });

      request.on('error', (error) => {
        reject({
          status: 500,
          statusText: error.message,
        });
      });
    });
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
