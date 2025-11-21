import mongoose from "mongoose";


const connectDB = async () => {
    try {
        const connection=await mongoose.connect(process.env.MONGO_DB_URI , {
        });


        console.log("[ SUCCESS ] MongoDB Connected Successfully")
    } catch (error) {
        console.log(`[ FAILURE ] Error Connecting MongoDB because ${error}`)
        process.exit(1)
    }
};

export default connectDB