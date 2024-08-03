const request = require('supertest');
const express = require('express');
const routes = require('../src/Routes/admin.route.js'); // Adjust the path to your routes file
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());
app.use('/admin', routes); // Mount the routes

// Connect to MongoDB before running tests
beforeAll(async () => {
  const url = process.env.MONGODB_UR || 'mongodb://localhost:27017/test';
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Close the connection after tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Admin API', () => {
  it('should create a new admin', async () => {
    const res = await request(app)
      .post('/admin/create')
      .send({
        adminEmail: 'admin@example.com',
        name: 'Admin User',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(200); // Adjust the status code based on your implementation
    expect(res.body).toHaveProperty('message'); // Adjust based on your response
  });

  it('should verify admin OTP', async () => {
    const res = await request(app)
      .post('/admin/verfiyotp')
      .send({
        adminEmail: 'admin@example.com',
        otp: '123456', // Adjust OTP based on what you get in email
      });
    expect(res.statusCode).toEqual(200); // Adjust the status code based on your implementation
    expect(res.body).toHaveProperty('message'); // Adjust based on your response
  });

  it('should add a song with admin key', async () => {
    const res = await request(app)
      .post('/admin/addsong')
      .send({
        adminkey: 'DD675B005633', // Replace with the actual admin key after verification
        name: 'New Song',
        artist: 'New Artist',
        image: 'http://example.com/image.jpg',
        audioLink: 'http://example.com/audio.mp3',
        openInAppLink: 'http://example.com/open',
        goToArtist: 'http://example.com/artist',
      });
    expect(res.statusCode).toEqual(201); // Adjust the status code based on your implementation
    expect(res.body).toHaveProperty('message'); // Adjust based on your response
  });

  it('should add an artist', async () => {
    const res = await request(app)
      .post('/admin/addartist')
      .send({
        adminkey: 'DD675B005633', // Replace with the actual admin key after verification
        name: 'New Artist',
        artistId: 'artist123',
        image: 'http://example.com/artist.jpg',
        biography: 'This is a biography',
        socialMedia: ['http://twitter.com/artist', 'http://instagram.com/artist'],
      });
    expect(res.statusCode).toEqual(200); // Adjust the status code based on your implementation
    expect(res.body).toHaveProperty('message'); // Adjust based on your response
  });
});
