import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { SignalSciencesCorp } from '../../types';

import { Entities } from '../constants';

export function createOrganizationEntity(corp: SignalSciencesCorp): Entity {
  return createIntegrationEntity({
    entityData: {
      source: corp,
      assign: {
        _key: corp.name,
        _type: Entities.ORGANIZATION._type,
        _class: Entities.ORGANIZATION._class,
        createdOn: parseTimePropertyValue(corp.created),
        name: corp.name,
        displayName: corp.displayName,
        smallIconURI: corp.smallIconURI,
        siteLimit: corp.siteLimit,
        sitesUri: corp.sites?.uri,
        authType: corp.authType,
        logoutURI: corp.logoutURI,
        samlCert: corp.samlCert,
        signRequestsUsingStoredCert: corp.signRequestsUsingStoredCert,
        samlRequestCert: corp.samlRequestCert,
        sessionMaxAgeDashboard: corp.sessionMaxAgeDashboard,
        apiTokenMaxAge: corp.apiTokenMaxAge,
        restrictedAccessTokens: corp.restrictedAccessTokens,
        ssoProvisioningConfigured: corp.ssoProvisioningConfigured,
        webLink: buildWebLink(corp.name),
      },
    },
  });
}

function buildWebLink(corpName) {
  return `https://dashboard.signalsciences.net/corps/${corpName}/overview`;
}
