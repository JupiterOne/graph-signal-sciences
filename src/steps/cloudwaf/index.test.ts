import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';

import { setupSigSciRecording } from '../../../test/recording';
import { IntegrationConfig } from '../../config';
import { fetchCloudWAF } from './';
import { integrationConfig } from '../../../test/config';
import { createOrganizationEntity } from '../organization/converter';
import { SignalSciencesCorp } from '../../types';

describe('should collect cloudwaf instance data', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupSigSciRecording({
      directory: __dirname,
      name: 'buildCorpAndCloudWAFRelationship',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('validate client integration and converters', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });
    await context.jobState.addEntity(
      createOrganizationEntity({
        name: 'jupiterone',
        displayName: 'JupiterOne',
      } as SignalSciencesCorp),
    );

    await fetchCloudWAF(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    const cloudwafInstances = context.jobState.collectedEntities.filter((e) =>
      e._class.includes('Firewall'),
    );
    expect(cloudwafInstances.length).toBeGreaterThan(0);
    expect(cloudwafInstances).toMatchGraphObjectSchema({
      _class: ['Firewall'],
      schema: {
        additionalProperties: false,
        properties: {
          _type: { const: 'sigsci_cloudwaf' },
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          name: { type: 'string' },
          displayName: { type: 'string' },
          category: {
            type: 'array',
            items: { type: 'string' },
          },
          description: { type: 'string' },
          region: { type: 'string' },
          tlsMinVersion: { type: 'string' },
          siteName: { type: 'string' },
          'deployment.Status': { type: 'string' },
          'deployment.Message': { type: 'string' },
          'deployment.EgressIps': {
            type: 'array',
            items: { type: 'string' },
          },
          'deployment.DnsEntry': { type: 'string' },
          useUploadedCertificates: { type: 'boolean' },
          createdBy: { type: 'string' },
          createdOn: { type: 'number' },
          updatedBy: { type: 'string' },
        },
      },
    });
  });
});
