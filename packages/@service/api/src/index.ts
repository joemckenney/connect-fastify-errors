import { fastify } from 'fastify';
import { fastifyConnectPlugin } from '@bufbuild/connect-fastify';
import routes from './connect';
import { cors as connectCors } from '@bufbuild/connect';
import fastifyCors from '@fastify/cors';

import { Connection } from './types';
import { Server } from 'socket.io';
import pino from 'pino';
import http from 'http';
import fastifyCookie from '@fastify/cookie';

const { APP_CLIENT_PORT, APP_CLIENT_HOST, NODE_ENV, DISABLE_CLOUD_LOG } =
  process.env;

async function initialize() {
  const server = fastify<http.Server, http.IncomingMessage>({
    disableRequestLogging: NODE_ENV === 'development',
    jsonShorthand: false,
    logger: pino({
      ...(NODE_ENV === 'production' && {
        transport: {
          target: '@dopt/cloud-pino',
          options: {
            cloudLoggingOptions: {
              skipInit: DISABLE_CLOUD_LOG === 'true',
              sync: true,
            },
          },
        },
      }),
    }),
  });

  let port = '';
  if (NODE_ENV === 'development') {
    port = `:${APP_CLIENT_PORT}`;
  }
  server.register(fastifyCookie);

  server.register(fastifyCors, {
    origin: [
      `http://${APP_CLIENT_HOST}${port}`,
      `https://${APP_CLIENT_HOST}${port}`,
    ],
    allowedHeaders: [...connectCors.allowedHeaders],
    exposedHeaders: [...connectCors.exposedHeaders],
    credentials: true,
  });


  server.get('/health-check', () => {
    return {
      application: 'gateway.dopt.com',
      status: 200,
    };
  });

  await server.register(fastifyConnectPlugin, {
    routes,
  });

  await server.listen({
    port: 6060,
    host: '::',
  });

  return server;
}

const service = initialize();
export { service };

