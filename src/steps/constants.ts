import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps = {
  ORGANIZATIONS: 'fetch-organizations',
  USERS: 'fetch-users',
  CLOUD_WAF: 'fetch-cloudwaf',
};

export const Entities: Record<
  'ORGANIZATION' | 'USER' | 'CLOUD_WAF',
  StepEntityMetadata
> = {
  ORGANIZATION: {
    resourceName: 'Organization',
    _type: 'sigsci_corp',
    _class: ['Organization'],
  },
  USER: {
    resourceName: 'User',
    _type: 'sigsci_user',
    _class: ['User'],
  },
  CLOUD_WAF: {
    resourceName: 'CloudWAF',
    _type: 'sigsci_cloudwaf',
    _class: ['Firewall'],
  },
};

export const Relationships: Record<
  'ORGANIZATION_HAS_USER' | 'ORGANIZATION_HAS_CLOUDWAF',
  StepRelationshipMetadata
> = {
  ORGANIZATION_HAS_USER: {
    _type: 'sigsci_corp_has_user',
    sourceType: Entities.ORGANIZATION._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  ORGANIZATION_HAS_CLOUDWAF: {
    _type: 'sigsci_corp_has_cloudwaf',
    sourceType: Entities.ORGANIZATION._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.CLOUD_WAF._type,
  },
};
