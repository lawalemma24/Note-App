import mongoose from 'mongoose';

const connectDB = async () => { 
    try {
        await mongoose.connect(process.env.CON_STRING);
        console.log("Database Connected Successfully");
    } catch (error) {
        console.error(" Database connection failed:", error.message);
        process.exit(1);
    }
}

export default connectDB;