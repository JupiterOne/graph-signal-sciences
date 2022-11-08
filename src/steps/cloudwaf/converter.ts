import {
  createIntegrationEntity,
  createDirectRelationship,
  parseTimePropertyValue,
  Entity,
  RelationshipClass,
  Relationship,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { SignalSciencesCloudWAF } from '../../types';

export function getCloudWAFKey(id: string): string {
  return `sigsci_cloudwaf:${id}`;
}

export function createCloudWAFEntity(cloudWAF: SignalSciencesCloudWAF): Entity {
  return createIntegrationEntity({
    entityData: {
      source: cloudWAF,
      assign: {
        _type: Entities.CLOUD_WAF._type,
        _class: Entities.CLOUD_WAF._class,
        _key: getCloudWAFKey(cloudWAF.id),
        name: cloudWAF.name,
        displayName: cloudWAF.name,
        category: ['application'],
        description: cloudWAF.description,
        region: cloudWAF.region,
        tlsMinVersion: cloudWAF.tlsMinVersion,
        siteName: cloudWAF.workspaceConfigs[0].siteName,
        'deployment.Status': cloudWAF.deployment.status,
        'deployment.Message': cloudWAF.deployment.message,
        'deployment.EgressIps': cloudWAF.deployment.egressIPs.map(
          (egressIp) => egressIp.ip,
        ),
        'deployment.DnsEntry': cloudWAF.deployment.dnsEntry,
        useUploadedCertificates: cloudWAF.useUploadedCertificates,
        createdBy: cloudWAF.createdBy,
        createdOn: parseTimePropertyValue(cloudWAF.created),
        updatedBy: cloudWAF.updatedBy,
      },
    },
  });
}

export function createOrganizationCloudwafRelationship(
  orgainzation: Entity,
  cloudWaf: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: orgainzation,
    to: cloudWaf,
  });
}
