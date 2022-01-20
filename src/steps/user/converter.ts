import {
  createIntegrationEntity,
  createDirectRelationship,
  parseTimePropertyValue,
  Entity,
  RelationshipClass,
  Relationship,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { SignalSciencesUser } from '../../types';

export function createUserEntity(
  corpName: string,
  user: SignalSciencesUser,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: user,
      assign: {
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        _key: user.email,
        createdOn: parseTimePropertyValue(user.created),
        username: user.email,
        name: user.name,
        displayName: user.name,
        email: user.email,
        mfaEnabled: user.mfaEnabled,
        active: user.status === 'active',
        role: user.role,
        webLink: buildWebLink(corpName, user.email),
      },
    },
  });
}

export function createOrganizationUserRelationship(
  orgainzation: Entity,
  user: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: orgainzation,
    to: user,
  });
}

function buildWebLink(corpName: string, userEmail: string) {
  return `https://dashboard.signalsciences.net/corps/${corpName}/users/${userEmail}`;
}
