import { StreamClient } from "@stream-io/node-sdk";
import { ENV } from "./env.js";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;
const streamClient = new StreamClient(apiKey, apiSecret);

export const getStreamToken = (userId) => {
    if (!userId) {
        return null;
    }
    else{
        try {
            const token = streamClient.generateUserToken({ 
                user_id: userId, 
            });

            return token;
        } catch (error) {
            console.error("Error generating Stream token:", error);
            return null;
        }
    }
};