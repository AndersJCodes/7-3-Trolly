import mongoose from "mongoose";

const uri = process.env.ATLAS_URI || "";
if (!uri) {
  console.error("ATLAS_URI is not set");
  process.exit(1);
}

async function connect(): Promise<void> {
  try {
    await mongoose.connect(uri, {});
    console.log("Connected to the database");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
}

export default connect;
