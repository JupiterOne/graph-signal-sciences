import { StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const organizationSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: /corps
     */
    id: 'fetch-organizations',
    name: 'Fetch Corps',
    entities: [
      {
        resourceName: 'Organization',
        _type: 'sigsci_corp',
        _class: ['Organization'],
      },
    ],
    relationships: [],
    dependsOn: [],
    implemented: true,
  },
];
