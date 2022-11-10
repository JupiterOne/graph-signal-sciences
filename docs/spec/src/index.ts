import { IntegrationSpecConfig } from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../../src/config';
import { userSpec } from './user';
import { organizationSpec } from './organization';
import { cloudwafSpec } from './cloudwaf';

export const invocationConfig: IntegrationSpecConfig<IntegrationConfig> = {
  integrationSteps: [...organizationSpec, ...userSpec, ...cloudwafSpec],
};
