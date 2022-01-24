import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';

import { setupSigSciRecording } from '../../../test/recording';

import { IntegrationConfig } from '../../config';
import { fetchUsers } from './';
import { integrationConfig } from '../../../test/config';
import { createOrganizationEntity } from '../organization/converter';
import { SignalSciencesCorp, SignalSciencesUser } from '../../types';

describe('should collect user data', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupSigSciRecording({
      directory: __dirname,
      name: 'buildCorpAndUserRelationship',
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
    context.jobState.addEntity(
      createOrganizationEntity({
        name: 'jupiterone',
        displayName: 'JupiterOne',
      } as SignalSciencesCorp),
    );

    // Act
    await fetchUsers(context);

    // Assert
    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    const users = context.jobState.collectedEntities.filter((e) =>
      e._class.includes('User'),
    );
    expect(users.length).toBeGreaterThan(0);
    expect(users).toMatchGraphObjectSchema({
      _class: ['User'],
      schema: {
        additionalProperties: false,
        properties: {
          _type: { const: 'sigsci_user' },
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          name: { type: 'string' },
          displayName: { type: 'string' },
          createdOn: { type: 'number' },
          username: { type: 'string' },
          email: { type: 'string' },
          mfaEnabled: { type: 'boolean' },
          active: { type: 'boolean' },
          role: { type: 'string' },
          webLink: { type: 'string' },
        },
      },
    });
  });
});
