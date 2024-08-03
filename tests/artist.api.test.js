const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const artistModel = require('../src/Models/artist.model.js');
const songModel = require('../src/Models/songs.model.js');
const routes = require('../src/Routes/user.route.js'); // Adjust the path to your routes file

const app = express();
app.use(express.json());
app.use('/user', routes);

describe('Artist API', () => {
  beforeAll(async () => {
    const mongoUri = 'mongodb://localhost:27017/testdb'; // Use a test database URI
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear the database before each test
    await artistModel.deleteMany({});
    await songModel.deleteMany({});
  });

  it('should fetch all artists', async () => {
    // Insert sample data
    await artistModel.create({ name: 'Artist 1', artistId: 'A1', image: 'image1.jpg', biography: 'Bio 1' });
    await artistModel.create({ name: 'Artist 2', artistId: 'A2', image: 'image2.jpg', biography: 'Bio 2' });

    const res = await request(app).get('/user/artists');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Data fetch Successfully 😉');
    expect(res.body.response).toHaveLength(2);
  });

  it('should fetch an artist by ID', async () => {
    // Insert sample data
    const artist = await artistModel.create({ name: 'Artist 1', artistId: 'A1', image: 'image1.jpg', biography: 'Bio 1' });
    await songModel.create({ name: 'Song 1', sId: 'S1', artistId: 'A1', artist: 'Artist 1', image: 'song1.jpg', audioLink: 'audio1.mp3', openInAppLink: 'link1', goToArtist: 'go1' });
    await songModel.create({ name: 'Song 2', sId: 'S2', artistId: 'A1', artist: 'Artist 1', image: 'song2.jpg', audioLink: 'audio2.mp3', openInAppLink: 'link2', goToArtist: 'go2' });

    const res = await request(app).get(`/user/artist/${artist.artistId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.response).toHaveProperty('artistDetails');
    expect(res.body.response.artistDetails.artistId).toEqual(artist.artistId);
    expect(res.body.response.top_10_songs).toHaveLength(2);
  });

  it('should return 404 for invalid artist ID', async () => {
    const res = await request(app).get('/user/artist/invalid_id');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error', ' Bad request 💩');
  });

  it('should return 404 if artist not found', async () => {
    const res = await request(app).get('/user/artist/A1');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error', ' Bad request 💩');
  });
});
