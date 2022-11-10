import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../../../src/config';

export const cloudwafSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: /corps/{corpName}/cloudwafinstance
     */
    id: 'fetch-cloudwaf',
    name: 'Fetch Cloud WAF',
    entities: [
      {
        resourceName: 'CloudWAF',
        _type: 'sigsci_cloudwaf',
        _class: ['Firewall'],
      },
    ],
    relationships: [
      {
        _type: 'sigsci_corp_has_cloudwaf',
        sourceType: 'sigsci_corp',
        _class: RelationshipClass.HAS,
        targetType: 'sigsci_cloudwaf',
      },
    ],
    dependsOn: ['fetch-organizations'],
    implemented: true,
  },
];
