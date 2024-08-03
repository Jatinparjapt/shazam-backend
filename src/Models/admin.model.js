const mongoose = require("mongoose")
const bcryptjs = require("bcryptjs")
const adminSchema = new mongoose.Schema({
    adminName:{type: String , required : true},
    password: {type : String , required: true , },
    adminEmail:{type : String , required: true , unique: true },
    secretKey: {type : String , unique: true},
    isRegistered: { type: Boolean, default: false },
    adminSignupOTP : {type : Number},
    adminSingupOTPExpires: { type: Date }
},{
    versionKey: false, // Disables the __v field
    timestamps: true   // Adds createdAt and updatedAt fields
})
adminSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password = await bcryptjs.hash(this.password, 12)
    }
    next()
})
const adminModel = mongoose.model("admin", adminSchema)
module.exports = adminModel