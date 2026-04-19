import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
    PORT : process.env.PORT,
    DATABASE_URI : process.env.DATABASE_URI,
    JWT_SECRET : process.env.JWT_SECRET,
    NODE_ENV : process.env.NODE_ENV,
    CLOUDINARY_CLOUD_NAME : process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY : process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET : process.env.CLOUDINARY_API_SECRET,
    CLIENT_URL : process.env.CLIENT_URL,
    STREAM_API_KEY:process.env.STREAM_API_KEY,
    STREAM_API_SECRET:process.env.STREAM_API_SECRET,
    GOOGLE_AUTH_CLIENT_ID:process.env.GOOGLE_AUTH_CLIENT_ID,
    GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
    RAZORPAY_API_ID: process.env.RAZORPAY_API_ID,
    RAZORPAY_SECRET_KEY : process.env.RAZORPAY_SECRET_KEY,
};