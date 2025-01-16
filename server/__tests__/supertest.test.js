import supertest from 'supertest';
import { beforeAll, afterEach, afterAll, describe, it, expect } from 'vitest';
import express from 'express';
import userRoutes from '../routes/userRoutes.js';
import * as db from './utils/db.js';
import dotenv from 'dotenv';

dotenv.config();

// creating Express app for testing
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mounting the route we want to test
app.use('/api/user', userRoutes);

// Setup tests
let server; //  will be initialized by express before each test
let request; // will be initialized by supertest package before each test

beforeAll(async () => {
  // connecting to in-memory MongoDB
  await db.connect();

  // starting a server and creating a supertest instance
  server = app.listen(0); // using port 0 lets the OS assign a random free port
  request = supertest(app);
});

afterEach(async () => {
  // clear database after each test
  await db.clearDatabase();
});

afterAll(async () => {
  // closes database and server
  await db.closeDatabase();
  server.close();
});

// REGISTRATION TESTING
describe('User Authentication Routes', () => {
  describe('POST /api/user/register', () => {
    // TESTING VALID USER REGISTRATION
    it('returns success message on valid user registration', async () => {
      const newUserData = {
        name: 'Test User',
        email: 'test@test.com',
        password: 'Password*123',
      };
      const response = await request
        .post('/api/user/register')
        .send(newUserData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.user.email).toBe(newUserData.email);
      expect(response.body.user.name).toBe(newUserData.name); // password needs to be hashed
    });
    // TESTING ERROR WHEN EMAIL ALREADY REGISTERED
    it('returns error when email is already registered', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@test.com',
        password: 'Password*123',
      };

      // First registration
      await request.post('/api/user/register').send(userData);

      // Attempt duplicate registration
      const response = await request.post('/api/user/register').send(userData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Email is already registered');
    });
    // TESTING ERROR IF EITHER NAME IS MISSING
    it('returns error if either name, email or password is missing', async () => {
      const userData = {
        email: 'test@test.com',
        password: 'Password*123',
      };

      // First registration
      const response = await request.post('/api/user/register').send(userData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        'Name, email, and password are required'
      );
    });

    // TESTING IF PASSWORD DOESN'T CONTAIN AT LEAST ONE UPPER CASE, ONE SPECIAL CHARACTER, AND ONE NUMBER
    it('returns error if password is missing an upper case letter, one number and one special character', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@test.com',
        password: 'password123',
      };

      // First registration
      const response = await request.post('/api/user/register').send(userData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        'Password requires one upper case letter, one number and one special character'
      );
    });
  });

  // LOGIN TESTING
  describe('POST /api/user/login', () => {
    it('returns token on successful login', async () => {
      // First register a user
      const userData = {
        name: 'Test User2',
        email: 'test2@test.com',
        password: 'Password*123',
      };
      const registerResponse = await request
        .post('/api/user/register')
        .send(userData);
      expect(registerResponse.status).toBe(201);

      // Attempt login
      const loginResponse = await request.post('/api/user/login').send({
        email: userData.email,
        password: userData.password,
      });
      console.log('Login Response:', loginResponse.body);

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.message).toBe('Login successful');
      expect(loginResponse.body.token).toBeDefined();

      expect(loginResponse.body.token.split('.').length).toBe(3);
    });

    it('returns error with invalid credentials', async () => {
      const response = await request.post('/api/user/login').send({
        email: 'wrong@email.com',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found');
    });
  });
});

/**
 * Docs: https://www.npmjs.com/package/supertest
 */

// test routes
// '/api/exercise'
// GET '/api/exercise/'                   Is this request done as soon as the user lands in the tabs page?
// POST '/api/exercise/'                  After user enters a new exercise - shouldn't this be /:id??
// PUT '/api/exercise/:id'
// DELETE '/api/exercise/:id'
// '/api/medications' -- NOT EVEN CREATED YET
// '/api/stats'       -- NOT EVEN CREATED YET --- DITCH STATS LINK???

// Best practices for Testing OAuth: the KEY is to test our application's handling of OAuth flows
// rather than testing the OAuth provider itself
// Mock external OAuth provider responses
// Test our server's handling of OAuth callbacks
// Test our database operations, i.e. testing to see our db creating a new user that just logged in with OAuth
// Test our token handling and session management

// What not to test:
// Actual calls to GitHub/Google servers
// Real OAuth provider authentication
// External database connections

// '/api/oauth'
// GET '/api/oauth/github/access-token'   Exchange code for an access token  --- Shouldn't this be a POST request??
// GET '/api/oauth/github/userdata'       Get user data from GitHub using the token -- Is this automatically done??
// POST '/api/oauth/github'               Upsert user in local DB             --

// Example of what you might test with Supertest
// describe('OAuth routes', () => {
//   it('should handle GitHub callback with valid code', async () => {
//     // Mock GitHub's response
//     const mockGithubResponse = {
//       access_token: 'mock_token',
//       user: { id: 123, login: 'testuser' }
//     };

//     // Mock the external call
//     nock('https://github.com')
//       .post('/login/oauth/access_token')
//       .reply(200, mockGithubResponse);

//     const response = await request(app)
//       .get('/api/oauth/github/callback')
//       .query({ code: 'test_code' });

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('token');
//   });

//   it('should handle database user creation', async () => {
//     // Test your own database operations
//     const response = await request(app)
//       .post('/api/oauth/github')
//       .send({
//         githubId: '123',
//         login: 'testuser',
//         email: 'test@example.com'
//       });

//     expect(response.status).toBe(200);
//   });
// });
