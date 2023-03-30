import mongoose from "mongoose";

const Reminder = mongoose.model('Reminder',
    new mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        recurring: Boolean,
        when: String,
        title: String,
        context: String,
        active: Boolean,
        taskName: String
    })
);

export default Reminder;
