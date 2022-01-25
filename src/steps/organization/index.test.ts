import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';

import { setupSigSciRecording } from '../../../test/recording';

import { IntegrationConfig } from '../../config';
import { fetchCorps } from './';
import { integrationConfig } from '../../../test/config';

describe('should collect corp data', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupSigSciRecording({
      directory: __dirname,
      name: 'buildCorp',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('validate client integration and converters', async () => {
    // Arrange
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    // Act
    await fetchCorps(context);

    // Assert
    const organizations = context.jobState.collectedEntities.filter((e) =>
      e._class.includes('Organization'),
    );
    expect(organizations.length).toBeGreaterThan(0);
    expect(organizations).toMatchGraphObjectSchema({
      _class: ['Organization'],
      schema: {
        additionalProperties: false,
        properties: {
          _type: { const: 'sigsci_corp' },
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          name: { type: 'string' },
          displayName: { type: 'string' },
          createdOn: { type: 'number' },
          smallIconURI: { type: 'string' },
          siteLimit: { type: 'number' },
          sitesUri: { type: 'string' },
          authType: { type: 'string' },
          logoutURI: { type: 'string' },
          samlCert: { type: 'string' },
          samlEndpoint: { type: 'string' },
          signRequestsUsingStoredCert: { type: 'boolean' },
          samlRequestCert: { type: 'string' },
          sessionMaxAgeDashboard: { type: 'number' },
          apiTokenMaxAge: { type: 'number' },
          restrictedAccessTokens: { type: 'boolean' },
          ssoProvisioningConfigured: { type: 'boolean' },
        },
      },
    });
  });
});
