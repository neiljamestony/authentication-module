import mongoose from "mongoose";

export const database_connection = async (url: string) => {
  try {
    const connect = await mongoose.connect(url);
    console.log(`you're connected to the database ${connect.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
