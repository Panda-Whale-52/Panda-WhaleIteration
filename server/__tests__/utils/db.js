// * Test Database Utility
//  *
//  * This file provides utility functions for managing an in-memory MongoDB instance
//  * during testing. It is not a test file itself, but rather a helper that:
//  * - Sets up an in-memory MongoDB instance
//  * - Provides functions to connect, clear, and close the test database
//  * - Ensures test isolation by managing database state between tests

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod;

// creates a new instance of "MongooseMemoryServer"
export const connect = async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  console.log('Test MongoDB connected');
};

// closes "MongooseMemoryServer"
export const closeDatabase = async () => {
  if (mongoose.connection.readyState) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod?.stop();
    console.log('Test MongoDB connection closed');
  }
};

export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  await Promise.all(
    Object.values(collections).map((collection) => collection.deleteMany({}))
  );
  console.log('Test MongoDB collections cleared');
};
