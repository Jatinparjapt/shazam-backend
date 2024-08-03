const express = require("express")
const routes = express.Router()
const {addSongApi,addArtist ,adminOTPVerify, adminCreate} = require("../Controllers/admin.api.js")
// login route for user 
// routes.post("/addsong/:adminkey", addSongApi)

// signupadmin 
routes.post("/create", adminCreate)
// adminotp verfication
routes.post("/verfiyotp",adminOTPVerify )

// add song 
routes.post("/addsong", addSongApi)
// add artist 
routes.post("/addartist",addArtist )

module.exports = routes
