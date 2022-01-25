import { organizationSteps } from './organization';
import { userSteps } from './user';

const integrationSteps = [...organizationSteps, ...userSteps];

export { integrationSteps };
