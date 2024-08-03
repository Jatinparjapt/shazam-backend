const express = require("express")
const routes = express.Router()
const {artists , artistById} = require("../Controllers/artist.api.js")
const {songsApi, songById} = require("../Controllers/songs.api.js")
const {loginUser,resetPassword ,forgetPassword, registerUser} = require("../Controllers/user.login.signup.js")
// login route for user 
routes.post("/user/login",loginUser )
// register new User route
routes.post("/user/signup", registerUser )
// forget password route
routes.post("/user/forgetpassword",forgetPassword)
// reset password route
routes.post ("/user/reset-password/:otp", resetPassword)
// get songs 
routes.get("/user/songs", songsApi );
// get song by id 
routes.get("/user/song/:songId", songById)
// get artits 
routes.get("/user/artists", artists );
// get artist by id 
routes.get("/user/artist/:artistId", artistById)
// exports routes
module.exports = routes
