import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import request from 'supertest';

import { User } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';
import { AuthModule } from './auth.module';
import { UserStatus } from '@/types/constants/user-status.constants';

jest.mock('@/shared/utils/gcs.utils', () => ({
  initializeGCS: jest.fn(),
  ensureGcsInitialized: jest.fn(),
  getGcsConfig: jest.fn(),
}));
jest.mock('@/services/email/user/email-auth.service', () => ({
  EmailAuthService: {
    sendPasswordResetEmail: jest.fn(),
    sendActivationEmail: jest.fn(),
    sendResendActivationEmail: jest.fn(),
  },
}));
describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;
  let userModel: Model<User>;
  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    userService = app.get<UserService>(UserService);
    userModel = app.get<Model<User>>(getModelToken(User.name));
  }, 30000);
  afterAll(async () => {
    await app.close();
  });
  describe('/auth/login (POST)', () => {
    const password = 'password123';
    const hashedPassword = bcrypt.hashSync(password, 10);
    beforeEach(async () => {
      await userModel.deleteMany({});
    });
    it('should login successfully with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password,
        })
        .expect(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe('test@example.com');
    });
    it('should reject login with invalid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
      expect(response.body).toHaveProperty('success', false);
    });
    it('should reject login with inactive user', async () => {
      await userModel.create({
        email: 'inactive@example.com',
        password: hashedPassword,
        role: 'MEMBER',
        status: UserStatus.INACTIVE,
      });
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'inactive@example.com',
          password,
        })
        .expect(401);
      expect(response.body).toHaveProperty('success', false);
    });
  });
  describe('/auth/register (POST)', () => {
    const userData = {
      email: 'newuser@example.com',
      password: 'password123',
      fullName: 'New User',
      employeeId: 'EMP003',
      role: 'MEMBER',
    };
    it('should register a new user successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(userData)
        .expect(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'User registered successfully');
      const user = await userModel.findOne({ email: userData.email });
      expect(user).toBeTruthy();
      expect(user.email).toBe(userData.email);
      expect(user.status).toBe(UserStatus.ACTIVE);
    });
    it('should reject registration with duplicate email', async () => {
      await request(app.getHttpServer()).post('/auth/register').send(userData).expect(201);
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(userData)
        .expect(400);
      expect(response.body).toHaveProperty('success', false);
    });
    it('should reject registration with invalid data', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: '123',
        fullName: '',
      };
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(invalidData)
        .expect(400);
      expect(response.body).toHaveProperty('success', false);
    });
  });
  describe('/auth/logout (POST)', () => {
    it('should logout successfully', async () => {
      const response = await request(app.getHttpServer()).post('/auth/logout').expect(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Logged out successfully');
    });
  });
  describe('/auth/forgot-password (POST)', () => {
    const password = 'password123';
    const hashedPassword = bcrypt.hashSync(password, 10);
    it('should send password reset email', async () => {
      const userData = {
        email: 'test@example.com',
        password: hashedPassword,
        role: 'MEMBER',
        status: UserStatus.ACTIVE,
      };
      await userModel.create(userData);
      const response = await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: userData.email })
        .expect(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Password reset email sent');
    });
    it('should handle non-existent email gracefully', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: 'nonexistent@example.com' })
        .expect(200);
      expect(response.body).toHaveProperty('success', true);
    });
  });
  describe('/auth/reset-password (POST)', () => {
    const password = 'password123';
    const hashedPassword = bcrypt.hashSync(password, 10);
    it('should reset password with valid token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/reset-password')
        .send({
          token: 'valid-token',
          newPassword: 'newpassword123',
        })
        .expect(200);
      expect(response.body).toHaveProperty('success', true);
    });
    it('should reject reset password with invalid token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/reset-password')
        .send({
          token: 'invalid-token',
          newPassword: 'newpassword123',
        })
        .expect(400);
      expect(response.body).toHaveProperty('success', false);
    });
  });
});
