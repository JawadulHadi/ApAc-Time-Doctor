import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { closeTestingModule, createTestingModule } from './scripts/setup-test';
jest.mock('@/shared/utils/gcs.utils', () => ({
  initializeGCS: jest.fn(),
  ensureGcsInitialized: jest.fn(),
  getGcsConfig: jest.fn(),
}));
describe('AppController (e2e)', () => {
  let app: INestApplication;
  let mongod: any;
  beforeAll(async () => {
    const setup = await createTestingModule();
    app = setup.app;
    mongod = setup.mongod;
  }, 120000);
  afterAll(async () => {
    await closeTestingModule({ app, mongod });
  });
  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(res => {
        expect(res.body.success).toBe(true);
        expect(res.body.data).toBe('APAC Management System API is running!');
      });
  });
  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect(res => {
        expect(res.body.success).toBe(true);
        expect(res.body.data.status).toBe('OK');
      });
  });
});
