import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ENV } from "./lib/env.js";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import projectRoutes from "./routes/project.route.js";
import messageRoutes from "./routes/message.route.js"; // Ensure this file exists
import profileRoutes from "./routes/profile.route.js";
import paymentRoutes from "./routes/payment.route.js";
import { app, server } from "./lib/socket.js"; 

const PORT = ENV.PORT;

app.use(express.json({limit: '10mb'}));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
    methods : ["GET", "POST", "PUT", "DELETE"]
}));

app.use("/api/auth", authRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/profile", profileRoutes); 
app.use("/api/payments", paymentRoutes);
connectDB();


server.listen(PORT, () => {
    console.log("Server is running on PORT: " + PORT);
    connectDB();
});