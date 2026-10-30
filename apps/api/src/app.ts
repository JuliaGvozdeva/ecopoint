import Fastify from 'fastify';

export function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    },
  });

  app.get('/health', async () => ({
    status: 'ok',
    service: 'ecopoint-api',
    timestamp: new Date().toISOString(),
  }));

  app.get('/api/v1', async () => ({
    name: 'EcoPoint API',
    version: 'v1',
  }));

  return app;
}
