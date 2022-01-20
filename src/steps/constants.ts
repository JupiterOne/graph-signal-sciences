import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps = {
  ORGANIZATIONS: 'fetch-organizations',
  USERS: 'fetch-users',
};

export const Entities: Record<'ORGANIZATION' | 'USER', StepEntityMetadata> = {
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
};

export const Relationships: Record<
  'ORGANIZATION_HAS_USER',
  StepRelationshipMetadata
> = {
  ORGANIZATION_HAS_USER: {
    _type: 'sigsci_corp_has_user',
    sourceType: Entities.ORGANIZATION._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
};
