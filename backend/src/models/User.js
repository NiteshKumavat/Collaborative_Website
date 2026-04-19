import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },

    resetPasswordToken: String,
    resetPasswordExpires: Date,

    plan: {
        type: String,
        enum: ['free', 'pro'],
        default: 'free'
    },
    razorpay_order_id: String,
    razorpay_payment_id: String,
    magicWandUses: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model("User", userSchema);
export default User