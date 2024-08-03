const artistModel = require("../Models/artist.model.js")
const songModel = require("../Models/songs.model.js")

const artists = async (req, res) => {
    try {
      const data = await artistModel.find();
      console.log(data, " data")
      return res.status(200).json({ message: "Data fetch Successfully 😉", response: data });

    } catch (error) {
      return res.status(500).json({ error: error });
    }
  };
const artistById = async (req ,res )=>{
    const { artistId} = req.params
    try{
        if(!artistId){
            return res.status(404).json({error : " Bad request 💩" })
        }
        const artistDetails = await artistModel.findOne({artistId :artistId})
        if(!artistDetails){
            return res.status(404).json({error : " Bad request 💩" })
        }
        const top_10_songs = await songModel.find({artistId: artistId}).limit(9);
        return res.status(200).json({response:{
            artistDetails,
            top_10_songs 
        }})
    }catch(error)
{
    return res.status(500).json({ error : error.message}) }
}


module.exports = {artists , artistById}