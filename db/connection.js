// import modules 
import mongoose from "mongoose";
export const connectDB =()=>{
    return mongoose.connect(process.env.DB_URL)
.then(() => {console.log('db connected successfully')})
.catch((err) => {console.log('failed to connect to db')})

}