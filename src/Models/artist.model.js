const mongoose = require("mongoose")

const artistSchema = new mongoose.Schema({
    name:{type: String , required : true},
    artistId : {type:String , required: true},
    socialMedia:  [ {link: {type : String  }}],
    image: {type : String , required: true },
    biography : {type:String}
},{
    versionKey: false, // Disables the __v field
    timestamps: true   // Adds createdAt and updatedAt fields
})

const artistModel = mongoose.model("Artists",artistSchema)
module.exports = artistModel