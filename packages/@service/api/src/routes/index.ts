import { Route, ApiGatewayService } from '../types';
import { route as healthCheck } from './health-check';
import { route as blocks } from './blocks';
import { route as analytics } from './analytics';
import { route as flowMetrics } from './flow-metrics';
import { route as auth } from './auth';
import { route as workspace } from './workspace';
import { route as environment } from './environment';
import { route as downstreamDestination } from './downstream-destination';
import { route as flow } from './flow';
import { route as block } from './block';
import { route as downstreamAnalytics } from './downstream-analytics';

import { withMiddleware } from '@dopt/connect-middleware';

export const routes: Route[] = [
  healthCheck,
  blocks,
  analytics,
  flowMetrics,
  ...auth,
  ...workspace,
  ...environment,
  ...downstreamDestination,
  ...flow,
  ...block,
  ...downstreamAnalytics,
];

export const serviceImplementation = withMiddleware<ApiGatewayService>(routes);
