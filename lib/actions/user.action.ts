"use server";

import { connectToDatabase } from "@/database/mongoose";
export const getAllUsersForNewsEmail = async () => {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    if (!db) {
      throw new Error("Database not connected");
    }

    const users = await db
      .collection("user")
      .find(
        { email: { $exists: true, $ne: null } },
        /**
         * Projection to select only the necessary fields
         * from the user database collection.
         *
         * @property {ObjectId} _id - MongoDB ObjectId
         * @property {string} id - User ID
         * @property {string} email - User email
         * @property {string} name - User name
         * @property {string} country - User country
         */
        { projection: { _id: 1, id: 1, email: 1, name: 1, country: 1 } }
      )
      .toArray();

    return users
      .filter((user) => user.email && user.name)
      .map((user) => ({
        id: user.id || user._id.toString(),
        name: user.name,
        email: user.email,
      }));
  } catch (error) {
    console.log(`Error fetching users ${error}`);
    return [];
  }
};
