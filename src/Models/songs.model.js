const mongoose = require("mongoose")

const songsSchema = new mongoose.Schema({

    name:{type: String , required : true},
    sId : {type:String, required: true},
    artistId: {type:String, required: true},
    artist: {type : String , required: true , },
    image: {type : String , required: true , },
    audioLink: {type:String , required:true},
    openInAppLink : {type:String , required:true},
    goToArtist: { type:String , required: true}
},{
    versionKey: false, // Disables the __v field
    timestamps: true   // Adds createdAt and updatedAt fields
})

const songModel = mongoose.model("Songs",songsSchema)
module.exports = songModel