import mongoose from "mongoose";

// writing funcition that connect to our database
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL);

    console.log(`mongodb connected:${connection.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};
export default connectDB;
