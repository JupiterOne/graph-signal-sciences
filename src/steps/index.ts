import { organizationSteps } from './organization';
import { userSteps } from './user';
import { cloudWAFSteps } from './cloudwaf';

const integrationSteps = [...organizationSteps, ...userSteps, ...cloudWAFSteps];

export { integrationSteps };
