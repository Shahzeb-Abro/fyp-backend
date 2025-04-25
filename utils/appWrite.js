import * as sdk from "node-appwrite";
import dotenv from "dotenv";
dotenv.config(); // Make sure to load env

export const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

export const storage = new sdk.Storage(client);
