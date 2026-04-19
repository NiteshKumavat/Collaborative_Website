import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },

    fullName : {
        type : String,
        required : true
    },

    email : {
        type : String,
        required : true
    },

    bio : {
        type : String
    },

    skills : [
        {
            type : String
        }
    ],

    profilePicture : {
        type : String
    },

    isAvailableForCollab : {
        type : Boolean,
        default : true
    },

    websites : [
        {
            websiteName : {
                type : String,
            },

            websiteLink : {
                type : String,
            }
        }
    ],

    blockList : [ 
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ]
}, {timestamps : true});

export default mongoose.model("Profile", ProfileSchema);
