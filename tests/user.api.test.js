const request = require('supertest');
const express = require('express');
const bcryptjs = require("bcryptjs")
const mongoose = require('mongoose');
const userModel = require('../src/Models/user.model.js');
const { loginUser, registerUser, forgetPassword, resetPassword } = require('../src/Controllers/user.login.signup.js'); // Adjust the path to your API file

const app = express();
app.use(express.json());
app.post('/login', loginUser);
app.post('/register', registerUser);
app.post('/forget-password', forgetPassword);
app.post('/reset-password/:otp', resetPassword);

describe('User API', () => {
  beforeAll(async () => {
    const mongoUri = 'mongodb://localhost:27017/testdb'; // Use a test database URI
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear the database before each test
    await userModel.deleteMany({});
  });

  it('should register a new user', async () => {
    const res = await request(app).post('/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.response).toHaveProperty('message', 'User Created Successfully 😎 ');
  });

  it('should not register a user with an existing email', async () => {
    await userModel.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    });

    const res = await request(app).post('/register').send({
      name: 'Jane Doe',
      email: 'john@example.com',
      password: 'password123'
    });
    expect(res.statusCode).toEqual(409);
    expect(res.body.response).toHaveProperty('message', 'Email already exists 🤔');
  });

  it('should login a user with correct credentials', async () => {
    const user = new userModel({
      name: 'John Doe',
      email: 'john@example.com',
      password: await bcryptjs.hash('password123', 12)
    });
    await user.save();

    const res = await request(app).post('/login').send({
      email: 'john@example.com',
      password: 'password123'
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'User Login Successfully 😎');
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('name', user.name);
  });

  it('should not login a user with incorrect credentials', async () => {
    const user = new userModel({
      name: 'John Doe',
      email: 'john@example.com',
      password: await bcryptjs.hash('password123', 12)
    });
    await user.save();

    const res = await request(app).post('/login').send({
      email: 'john@example.com',
      password: 'wrongpassword'
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error', 'Invalid Credentials 🥲 ');
  });

  it('should send a reset password link', async () => {
    const user = new userModel({
      name: 'John Doe',
      email: 'john@example.com',
      password: await bcryptjs.hash('password123', 12)
    });
    await user.save();

    const res = await request(app).post('/forget-password').send({
      email: 'john@example.com'
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Reset link sent to your email');
  });

  it('should not send a reset password link for non-existing email', async () => {
    const res = await request(app).post('/forget-password').send({
      email: 'nonexistent@example.com'
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'User not found 🙄 ');
  });

  it('should reset the password with a valid token', async () => {
    const user = new userModel({
      name: 'John Doe',
      email: 'john@example.com',
      password: await bcryptjs.hash('password123', 12),
      resetPasswordToken: 'validtoken',
      resetPasswordExpires: Date.now() + 3600000 // 1 hour
    });
    await user.save();

    const res = await request(app).post('/reset-password/validtoken').send({
      password: 'newpassword123'
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Password has been updated');
  });

  it('should not reset the password with an invalid or expired token', async () => {
    const user = new userModel({
      name: 'John Doe',
      email: 'john@example.com',
      password: await bcryptjs.hash('password123', 12),
      resetPasswordToken: 'validtoken',
      resetPasswordExpires: Date.now() - 3600000 // Token expired 1 hour ago
    });
    await user.save();

    const res = await request(app).post('/reset-password/validtoken').send({
      password: 'newpassword123'
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Password reset token is invalid or has expired.');
  });
});
