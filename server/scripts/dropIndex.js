import mongoose from "mongoose";
import User from "../models/userModel.js";

const MONGO_URI =
  "mongodb+srv://oliverafajardoucb1:AFrHIEwxaya01phE@cluster0.boihq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function dropGithubIdIndex() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    await User.collection.dropIndex("githubId_1");
    console.log("Successfully dropped githubId index");
  } catch (error) {
    console.error("Error dropping index:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

dropGithubIdIndex();
