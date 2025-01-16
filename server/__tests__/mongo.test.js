import supertest from 'supertest';
import { beforeAll, afterAll, describe, it, expect, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import app from '../server.js';
import User from '../models/userModel.js';

const request = supertest(app);

// Use a separate test database
const TEST_MONGODB_URI =
  'mongodb+srv://fabianosantin:37NDFZdJysWbxRsHGiVY@cluster0.zecqa.mongodb.net/project_iter_testing?retryWrites=true&w=majority';

let server;

// Start MongoDB before each test
beforeAll(async () => {
  try {
    await mongoose.connect(TEST_MONGODB_URI);
    console.log('Connected to test database');
    server = app.listen(0);
  } catch (error) {
    console.log('Database connection error:', error);
  }
});

// Delete test data and close connection after each test
afterAll(async () => {
  // Clean up test data
  await User.deleteMany({});
  await mongoose.connection.close();
  await server.close();
});

describe('MongoDB Integration Tests', () => {
  describe('Database Connection', () => {
    it('should connect to test database', async () => {
      // Your existing beforeAll logic can be moved here
      expect(mongoose.connection.readyState).toBe(1); // 1 means 'connected'
    });
  });

  describe('E2E User Authentication Tests', () => {
    beforeEach(async () => {
      // Clean up before each test
      await User.deleteMany({});
    });

    // TESTING REGISTRATION AND LOG IN
    it('should register and login a user in a real database', async () => {
      // Test user registration
      const userData = {
        name: 'E2E Test User',
        email: 'e2e@test.com',
        password: 'Password123$',
      };

      const registerResponse = await request
        .post('/api/user/register')
        .send(userData);

      expect(registerResponse.status).toBe(201);

      // Verify user was actually saved in database
      const savedUser = await User.findOne({ email: userData.email });
      expect(savedUser).toBeTruthy();
      expect(savedUser.name).toBe(userData.name);

      // Test login
      const loginResponse = await request.post('/api/user/login').send({
        email: userData.email,
        password: userData.password,
      });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.token).toBeDefined();
    });

    it('should be blocked from accessing by trying a wrong password', async () => {
      // Test user registration
      const userData = {
        name: 'Wrong User',
        email: 'wrong@test.com',
        password: 'wrongPass$',
      };

      // Verify user was actually saved in database
      const savedUser = await User.findOne({ email: userData.email });
      expect(savedUser).toBeFalsy();
      // expect(savedUser.name).toBe(userData.name);

      // Test login
      const loginResponse = await request.post('/api/user/login').send({
        email: userData.email,
        password: userData.password,
      });

      expect(loginResponse.status).toBe(404);
      expect(loginResponse.body.error).toBe('User not found');
    });
  });
});
