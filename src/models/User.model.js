import mongoose from "mongoose"
import bcryptjs from "bcryptjs"
const userSchema = new mongoose.Schema({
 userName:{
  required:[true,"Username is required"],
  trim:true,
  type:String,
  unique:[true,"This username is already taken"]
 },
 email:{
  required:[true,"Email is required"],
  trim:true,
  lowercase:true,
  type:String,
  unique:[true,"This email is already raken"]
 },
 password:{
  type:String,
  trim:true,
  required:[true,"Password is required"],
  select:false
 }
 
},{timestamps:true})

userSchema.pre("save",async function(){
 if(!this.isModified("password")){
  return
 }
 const hash = await bcryptjs.hash(this.password,10)
 
 this.password = hash
 return
})

userSchema.methods.comparePassword =async  function(enteredPassword){
 return await bcryptjs.compare(enteredPassword,this.password)

 }

export default mongoose.model("User",userSchema)