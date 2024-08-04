# API Endpoints

## Admin Routes

### Create Admin

Method: POST
Endpoint: /admin/create

Request Body (JSON):

```json
{
  "adminEmail": "<email>",
  "name": "<name>",
  "password": "<password>"
}
```

Response:

**200 OK on success**
**400 for validation errors**
**409 if email already exists**

## Verify Admin OTP

Method: POST
Endpoint: /admin/verfiyotp

Request Body (JSON):

```json
{
  "adminEmail": "<email>",
  "otp": "<otp>"
}
```

Response:

**200 OK on success**
**400 if OTP is invalid or expired**
**404 if admin not found**

## Add Song

Method: POST
Endpoint: /admin/addsong

Request Body (JSON):

```json
{
  "adminkey": "<admin-key>",
  "name": "<song-name>",
  "artist": "<artist-name>",
  "image": "<image-url>",
  "audioLink": "<audio-url>",
  "openInAppLink": "<app-link>",
  "goToArtist": "<artist-link>"
}
```

Response:

**201 Created on success**
**401 for unauthorized access**
**400 if any field is missing**

## Add Artist

Method: POST
Endpoint: /admin/addartist

Request Body (JSON):

```json
{
  "adminkey": "<admin-key>",
  "name": "<artist-name>",
  "artistId": "<artist-id>",
  "image": "<image-url>",
  "biography": "<biography>",
  "socialMedia": ["<link>"]
}
```

Response:

**200 OK on success**
**401 for unauthorized access**
**400 if any field is missing**

# User Routes

## User Login

Method: POST
Endpoint: /user/login

Request Body (JSON):

```json
{
  "email": "<email>",
  "password": "<password>"
}
```

Response:

**200 OK with JWT token on success**
**401 for invalid credentials**
**400 if fields are missing**

## User Signup

Method: POST
Endpoint: /user/signup

Request Body (JSON):

```json
{
  "email": "<email>",
  "password": "<password>",
  "name": "<name>"
}
```

Response:

**201 Created on success**
**409 if email already exists**
**400 if fields are missing**

## Forget Password

Method: POST
Endpoint: /user/forgetpassword

Request Body (JSON):

```json
{
  "email": "<email>"
}
```

Response:

**200 OK on success**
**400 if user not found**
**400 if email field is missing**

## Reset Password

Method: POST
Endpoint: /user/reset-password/:otp

Request Body (JSON):

```json
{
  "password": "<new-password>"
}
```

Response:

**200 OK on success**
**400 if token is invalid or expired**
**400 if password field is missing**

# Artist Routes

## Get All Artists

Method: GET
Endpoint: /user/artists

Response:

**200 OK with list of artists**
**500 for server errors**

## Get Artist by ID

Method: GET
Endpoint: /user/artist/:artistId

## Response:

**200 OK with artist details and top 10 songs**
**404 if artist not found**

# Song Routes

## Get All Songs

Method: GET
Endpoint: /user/songs

## Query Parameters: limit, page

## Response:

**200 OK with list of songs**
**404 if no songs found**

## Get Song by ID

Method: GET
Endpoint: /user/song/:songId

Response:

**200 OK with song details**
**404 if song not found**

## Usage

Start the server

```bash
node index.js
```

The server will be running at http://localhost:<PORT>, where <PORT> is defined in your .env file.

## Testing

To run tests, use the following command:

```bash
npm test
```

Ensure that you have set up your test database and environment variables accordingly.
