import mongoose from "mongoose"

const BlackListTokenSchema = new mongoose.Schema({
    token:{
        type:String,
        required:true,
        unique:true
    }
},{timestamps:true})

export default mongoose.model("BlackListToken",BlackListTokenSchema)