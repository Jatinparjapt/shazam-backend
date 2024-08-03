const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const songModel = require('../src/Models/songs.model.js');
const { songsApi, songById } = require('../src/Controllers/songs.api.js'); // Adjust the path to your API file

const app = express();
app.use(express.json());
app.get('/songs', songsApi);
app.get('/song/:songId', songById);

describe('Songs API', () => {
  beforeAll(async () => {
    const mongoUri = 'mongodb://localhost:27017/testdb'; // Use a test database URI
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear the database before each test
    await songModel.deleteMany({});
  });

  it('should fetch songs with pagination', async () => {
    // Insert sample data
    await songModel.create([
      { name: 'Song 1', sId: 'S1', artistId: 'A1', artist: 'Artist 1', image: 'image1.jpg', audioLink: 'audio1.mp3', openInAppLink: 'link1', goToArtist: 'go1' },
      { name: 'Song 2', sId: 'S2', artistId: 'A2', artist: 'Artist 2', image: 'image2.jpg', audioLink: 'audio2.mp3', openInAppLink: 'link2', goToArtist: 'go2' }
    ]);

    const res = await request(app).get('/songs?limit=1&page=1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Data fetched successfully 😉');
    expect(res.body.response).toHaveLength(1);
    expect(res.body.pagination).toHaveProperty('page', 1);
    expect(res.body.pagination).toHaveProperty('limit', 1);
  });

  it('should return 404 if no songs found', async () => {
    const res = await request(app).get('/songs');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error', 'No songs found 💩');
  });

  it('should fetch a song by ID', async () => {
    // Insert sample data
    const song = await songModel.create({ name: 'Song 1', sId: 'S1', artistId: 'A1', artist: 'Artist 1', image: 'image1.jpg', audioLink: 'audio1.mp3', openInAppLink: 'link1', goToArtist: 'go1' });

    const res = await request(app).get(`/song/${song._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Data fetch Successfully 😉');
    expect(res.body.response).toHaveProperty('_id', song._id.toString());
  });

  it('should return 404 if song not found', async () => {
    const res = await request(app).get('/song/invalid_id');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error', ' Bad request 💩');
  });

  it('should return 404 for invalid song ID', async () => {
    const res = await request(app).get('/song/64f03bfedabf4a83bdf3c230');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error', ' Bad request 💩');
  });
});
