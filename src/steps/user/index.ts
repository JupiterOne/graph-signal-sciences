import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Entities, Steps, Relationships } from '../constants';
import {
  createOrganizationUserRelationship,
  createUserEntity,
} from './converter';

export async function fetchUsers({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await jobState.iterateEntities(
    { _type: Entities.ORGANIZATION._type },
    async (organizationEntity) => {
      const corpName = organizationEntity._key;
      await apiClient.iterateUsers(corpName, async (user) => {
        const userEntity = await jobState.addEntity(
          createUserEntity(corpName, user),
        );
        await jobState.addRelationship(
          createOrganizationUserRelationship(organizationEntity, userEntity),
        );
      });
    },
  );
}

export const userSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.USERS,
    name: 'Fetch Users',
    entities: [Entities.USER],
    relationships: [Relationships.ORGANIZATION_HAS_USER],
    dependsOn: [Steps.ORGANIZATIONS],
    executionHandler: fetchUsers,
  },
];
