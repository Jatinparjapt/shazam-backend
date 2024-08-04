const express = require("express")
const app = express()
const cors = require("cors")
const connection = require("./src/connection/connect.db")
const routes = require("./src/Routes/user.route.js")
const adminRoutes = require("./src/Routes/admin.route.js")
const artists = require("./src/Controllers/artist.api.js")
// config
require("dotenv").config()

// middleware
app.use(express.json())
app.use(cors())


// routes , api routes 
app.use("/api",routes)
// admin routes
app.use("/admin",adminRoutes)
// home route, default route





app.get("/", artists)

// Port 
const PORT  = process.env.PORT || 8000

// listing sever 
connection()
app.listen(PORT , ()=>{
    console.log(`Server start listing on port ${PORT}`)
})

