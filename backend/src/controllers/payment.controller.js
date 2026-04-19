import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

// Initialize Razorpay
const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: ENV.RAZORPAY_API_ID,
    key_secret: ENV.RAZORPAY_SECRET_KEY,
  });
};

export const createOrder = async (req, res) => {
  try {
    const razorpay = getRazorpayInstance();
    
    // Pro plan is ₹199
    const options = {
      amount: 199 * 100, 
      currency: "INR",
      receipt: `receipt_${req.user._id}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).json({ message: "Failed to create order" });
    }

    // Save the order id to the user
    await User.findByIdAndUpdate(req.user._id, {
      razorpay_order_id: order.id,
    });

    return res.status(200).json({ order });
  } catch (error) {
    console.error("Create Order Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create the expected signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", ENV.RAZORPAY_SECRET_KEY)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      user.plan = "pro";
      user.razorpay_payment_id = razorpay_payment_id;
      user.razorpay_order_id = razorpay_order_id; 
      await user.save();

      return res.status(200).json({ message: "Payment successful, upgraded to Pro" });
    } else {
      return res.status(400).json({ message: "Invalid Signature" });
    }
  } catch (error) {
    console.error("Verify Payment Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};