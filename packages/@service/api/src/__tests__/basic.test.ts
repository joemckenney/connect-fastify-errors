import { HealthCheckResponse_ServingStatus } from '@service/definition';
import { client } from '@service/web-client';
import { ConnectError } from '@bufbuild/connect';

describe('@service/service', () => {

  describe('client.healthCheck(...)', () => {
    it('should get correct error response from healthcheck method', async () => {
      try {
        await client.healthCheck({});
      } catch (e) {
        if (e instanceof ConnectError) {
          console.log(e.metadata);
          console.log(e.code);
          console.log(e.message);
        }
        expect(false).toEqual(true);
      }
    });
  });
});
