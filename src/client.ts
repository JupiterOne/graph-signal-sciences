import axios, { AxiosRequestConfig } from 'axios';

import {
  IntegrationProviderAuthenticationError,
  IntegrationProviderAPIError,
  IntegrationLogger,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from './config';
import {
  SignalSciencesUser,
  SignalSciencesCorp,
  SigSciResponseFormat,
} from './types';

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
  constructor(
    readonly logger: IntegrationLogger,
    readonly config: IntegrationConfig,
  ) {}

  public async verifyAuthentication(): Promise<void> {
    const endpoint = `${BASE_URI}/corps`;

    await this.fetchWithRetries(endpoint, {
      headers: this.generateHeaders(),
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

    const { data } = await this.fetchWithRetries(endpoint, {
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

    const { data } = await this.fetchWithRetries(endpoint, {
      headers: this.generateHeaders(),
    });

    for (const user of data) {
      await iteratee(user);
    }
  }

  private buildEndpoint(corp: string, path?: string) {
    if (!corp) {
      throw new Error(`Parameter 'corp' is required, but received ${corp}`);
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

  private async fetchWithRetries(endpoint, options, retries = 0) {
    try {
      return await this.fetch(endpoint, options);
    } catch (error) {
      if ([429, 503, 504].includes(error.status) && retries < 5) {
        // TODO: add delay before retry (spoulton - 1/2022)
        return await this.fetchWithRetries(endpoint, options, ++retries);
      } else {
        throw error;
      }
    }
  }

  /**
   * Makes GET request and then
   * parses JSON result, returning the data.
   * @param endpoint
   * @param options
   * @returns Promise
   */
  private async fetch(
    endpoint: string,
    options: AxiosRequestConfig,
  ): Promise<SigSciResponseFormat> {
    const { status, statusText, data } = await axios.get(endpoint, {
      ...options,
      validateStatus: () => true,
    });

    if (status === 200) {
      return data as SigSciResponseFormat;
    } else if (status === 401) {
      throw new IntegrationProviderAuthenticationError({
        endpoint,
        status: status,
        statusText: statusText,
      });
    } else {
      throw new IntegrationProviderAPIError({
        endpoint,
        status: status,
        statusText: statusText,
      });
    }
  }
}

export function createAPIClient(
  logger: IntegrationLogger,
  config: IntegrationConfig,
): APIClient {
  return new APIClient(logger, config);
}
