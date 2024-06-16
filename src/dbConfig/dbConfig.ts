import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    const connection = await mongoose.connection

    connection.on("connected", () => {
        console.log("MongoDB connection established");
      });

    connection.on("error", (error) => {
      console.error("MongoDB connection error", error);
      process.exit();
    });

   
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
}

export default connect;