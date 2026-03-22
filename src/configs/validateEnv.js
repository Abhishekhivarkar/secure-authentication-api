export const validateEnv = (config) =>{
 const requiredEnv = [
  "MONGO_URI",
  "JWT_SECRET",
  "PORT",
  "BREVO_API_KEY",
  "BREVO_SENDER_EMAIL",
  "BREVO_SENDER_NAME",
  "CLIENT_URL",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET"
  ]
  requiredEnv.forEach((key) =>{
   if(!config[key]){
    throw new Error(`${key} is not defined in environment variables`)
   }
  })
}