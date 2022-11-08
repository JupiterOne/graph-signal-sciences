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

export interface SignalSciencesCloudWAF {
  id: string;
  name: string;
  description: string;
  region: string;
  tlsMinVersion: string;
  workspaceConfigs: {
    siteName: string;
    instanceLocation: string;
    clientIPHeader: string;
    litstenerProtocols: string;
    routes: {
      certificateIds: string[];
      domains: string[];
      origin: string;
      passHostHeader: boolean;
      id: string;
      connectionPooling: boolean;
      trustProxyHeaders: boolean;
    }[];
  }[];
  deployment: {
    status: string;
    message: string;
    egressIPs: {
      ip: string;
      status: string;
      updatedAt: string;
    }[];
    dnsEntry: string;
  };

  useUploadedCertificates: boolean;
  createdBy: string;
  created: string;
  updatedBy: string;
}

export interface SigSciResponseFormat {
  data?: any;
  message?: string;
}
