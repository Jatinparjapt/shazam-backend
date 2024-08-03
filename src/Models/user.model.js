const mongoose = require("mongoose")
const bcryptjs = require("bcryptjs")
const userSchema = new mongoose.Schema({
    name:{type: String , required : true},
    password: {type : String , required: true , },
    email: {type : String , required: true , unique: true },
    tokens: [{  token : {type : String , required: true}}],
    resetPasswordToken: String,
    resetPasswordExpires: Date 
},{
    versionKey: false, // Disables the __v field
    timestamps: true   // Adds createdAt and updatedAt fields
})
// encreate password before save to database
userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password = await bcryptjs.hash(this.password, 12)
    }
    next()
})
userSchema.methods.generateAuthToken = async function(){
    const tokenJwt = jwt.sign({_id:this._id}, process.env.SCREAT_KEY)
    this.tokens = this.tokens.concat({token:tokenJwt})
    await this.save();
    return tokenJwt
}
const userModel = mongoose.model("Users",userSchema)
module.exports = userModel