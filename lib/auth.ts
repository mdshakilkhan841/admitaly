import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db();

export const auth = betterAuth({
    appName: "Admitaly",
    user: {
        additionalFields: {
            role: {
                type: "string",
                default: "user",
                required: true,
                enum: ["user", "admin", "super-admin"],
                // input: false,
            },
        },
    },
    database: mongodbAdapter(db, {
        client,
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
    },
    secret: process.env.BETTER_AUTH_SECRET,
});
