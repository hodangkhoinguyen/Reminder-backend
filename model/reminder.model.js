import mongoose from "mongoose";

const User = mongoose.model('User',
    new mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        recurring: Boolean,
        when: String,
        active: Boolean
    })
);

export default User;
