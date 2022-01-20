import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const userSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: /corps/{corpName}/users
     */
    id: 'fetch-users',
    name: 'Fetch Users',
    entities: [
      {
        resourceName: 'User',
        _type: 'sigsci_user',
        _class: ['User'],
      },
    ],
    relationships: [
      {
        _type: 'sigsci_corp_has_user',
        sourceType: 'sigsci_corp',
        _class: RelationshipClass.HAS,
        targetType: 'sigsci_user',
      },
    ],
    dependsOn: ['fetch-organizations'],
    implemented: true,
  },
];
