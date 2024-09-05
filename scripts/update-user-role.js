require("dotenv").config();
const connectToDatabase = require("../config/database");
const mongoose = require("mongoose");
const { User } = require("../models/user");

async function updateUserRole(email, newRole) {
    await connectToDatabase();
    try {
        console.log("Connected to MongoDB");

        const user = await User.findOne({ email });

        if (!user) {
            console.log(`User with email ${email} not found`);
            return;
        }

        const isAdmin = newRole === "admin" || newRole === "superAdmin";
        user.role = newRole;
        user.isAdmin = isAdmin;
        // user.name = "ytrwarew"; // set name if needed
        user.verified = true; // unverified users do not have access to admin

        await user.save();

        console.log(`Updated user ${user.email}:`);
        console.log(`Role: ${user.role}`);
        console.log(`Name: ${user.name}`);
        console.log(`isAdmin: ${user.isAdmin}`);
        console.log(`Verified: ${user.verified}`);
        console.log(`Email Verified: ${user.emailVerified}`);
    } catch (error) {
        console.error("Error during user role update:", error);
    } finally {
        await mongoose.connection.close();
        console.log("Disconnected from MongoDB");
    }
}

const emails = ['q@mail.com'];
const newRole = "superAdmin";

// Set user(s) to admin or superAdmin
Promise.all(emails.map(email => updateUserRole(email, newRole)))
    .then(() => console.log("All user role updates completed"))
    .catch((error) =>
        console.error("Unhandled error during user role updates:", error)
    );
