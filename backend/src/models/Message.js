import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    teamId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Project",
        required : true
    },

    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },

    message : {
        type : String,
    },

    image : {
        type : String,
    },
}, {timestamps : true});

const Message = mongoose.model("Message", messageSchema);

export default Message;