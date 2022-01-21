import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Steps, Entities } from '../constants';
import { createOrganizationEntity } from './converter';

export const ORGANIZATIONS_ENTITY_KEY = 'entity:organizations';

export async function fetchCorps({
  logger,
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(logger, instance.config);

  logger.info('Querying for corps from signal sciences...');

  await apiClient.iterateCorps(async (corp) => {
    await jobState.addEntity(createOrganizationEntity(corp));
  });
}

export const organizationSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.ORGANIZATIONS,
    name: 'Fetch Corps',
    entities: [Entities.ORGANIZATION],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchCorps,
  },
];
