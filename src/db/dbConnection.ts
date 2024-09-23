import mongoose from "mongoose";

const uri = process.env.ATLAS_URI || "";
const user = process.env.MONGODB_USER || "";
const pass = process.env.MONGODB_PASS || "";

async function connect() {
  try {
    await mongoose.connect(uri, {
      user: user,
      pass: pass,
    });
    console.log("Connected to the database");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
}

export default connect;
