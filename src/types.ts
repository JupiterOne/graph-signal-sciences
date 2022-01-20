export interface SignalSciencesUser {
  name: string;
  email: string;
  role: string;
  status: 'active';
  mfaEnabled: boolean;
  created: string;
  accessTokenAllowed: boolean;
  ssoProvisioned: boolean;
}

export interface SignalSciencesCorp {
  name: string;
  displayName: string;
  smallIconURI: string;
  created: string;
  siteLimit: number;
  sites?: {
    uri: string;
  };
  authType: string;
  logoutURI: string;
  samlCert: string;
  signRequestsUsingStoredCert: boolean;
  samlRequestCert: string;
  sessionMaxAgeDashboard: number;
  apiTokenMaxAge: number;
  restrictedAccessTokens: boolean;
  ssoProvisioningConfigured: boolean;
}
