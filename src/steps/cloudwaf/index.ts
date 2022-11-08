import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Entities, Steps, Relationships } from '../constants';
import {
  createOrganizationCloudwafRelationship,
  createCloudWAFEntity,
} from './converter';

export async function fetchCloudWAF({
  logger,
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(logger, instance.config);

  logger.info('Querying for cloudwaf entities from signal sciences...');

  await jobState.iterateEntities(
    { _type: Entities.ORGANIZATION._type },
    async (organizationEntity) => {
      const corpName = organizationEntity._key;
      await apiClient.iterateCloudWAFInstances(corpName, async (cloudwaf) => {
        const cloudwafEntity = await jobState.addEntity(
          createCloudWAFEntity(cloudwaf),
        );

        await jobState.addRelationship(
          createOrganizationCloudwafRelationship(
            organizationEntity,
            cloudwafEntity,
          ),
        );
      });
    },
  );
}

export const cloudWAFSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.CLOUD_WAF,
    name: 'Fetch Cloud WAF',
    entities: [Entities.CLOUD_WAF],
    relationships: [Relationships.ORGANIZATION_HAS_CLOUDWAF],
    dependsOn: [Steps.ORGANIZATIONS],
    executionHandler: fetchCloudWAF,
  },
];
