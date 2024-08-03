const songModel = require("../Models/songs.model.js")

const songsApi = async (req, res) => {
    try {
      // Get limit and page from query parameters
      const limit = parseInt(req.query.limit) || 20; // Default limit to 20 if not provided
      const page = parseInt(req.query.page) || 1;    // Default page to 1 if not provided
  
      // Calculate the number of documents to skip
      const skip = (page - 1) * limit;
  
      // Fetch the songs with limit and skip for pagination
      const songs = await songModel.find().limit(limit).skip(skip);
        console.log(songs, "songs")
      // Check if songs were found
      if (songs.length > 0) {
        return res.status(200).json({
          message: "Data fetched successfully 😉",
          response: songs,
          pagination: {
            page: page,
            limit: limit,
          },
        });
      } else {
        return res.status(404).json({ error: "No songs found 💩" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };

const songById = async (req ,res )=>{
    const {songId} = req.params
    try {
        const data = await songModel.findOne({_id:songId})
        if(!data){
            return res.status(404).json({error : " Bad request 💩" })
        }
        return res.status(200).josn({message:"Data fetch Successfully 😉", response : data})
        
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}


module.exports = {songsApi, songById}