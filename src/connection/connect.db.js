const mongoose = require("mongoose")
const connecton =  async()=>{
    try {
        await mongoose.connect(process.env.MONGOOSE_URI)
        console.log("connected to mongodb successfully")
    } catch (error) {
        console.error(error)
    }
}

module.exports = connecton