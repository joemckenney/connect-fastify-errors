import { Code, ConnectError, ConnectRouter } from '@bufbuild/connect';
import {
  Service,
  HealthCheckResponse_ServingStatus,
} from '@service/definition';


export default (router: ConnectRouter) => {
  router.service(Service, {
    healthCheck: async () => {
      throw new ConnectError('Throttled', Code.ResourceExhausted);
      return {
        status: HealthCheckResponse_ServingStatus.SERVING,
      };
    },
  });
};
