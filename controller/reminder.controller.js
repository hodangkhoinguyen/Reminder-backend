import db from "../model/index.js";
import cronSchedule from "node-schedule";
import mailer from "./mailer.js";

const User = db.user;
const Reminder = db.reminder;

async function createReminder(req, res, next) {
    try {
        // Gather information of the reminder from API request
        const userId = req.userId;
        const recurring = req.body.reminder.recurring === "true";
        const active = req.body.reminder.active === "true";
        const when = req.body.reminder.when;
        const title = req.body.reminder.title;
        const context = req.body.reminder.context;

        let schedule = when;

        // Handle schedule for the new reminder
        if (!recurring) {
            schedule = new Date(when);
        }

        const task = cronSchedule.scheduleJob(schedule, function() {
            mailer(userEmail, title, context);
        });

        // Create a new reminder
        const reminder = new Reminder({
            user: userId,
            recurring: recurring,
            when: when,
            title: title,
            context: context,
            active: active,
            taskName: task.name
        })

        // Add new reminder to Reminder DB
        const newReminder = await reminder.save();
        const reminderId = newReminder._id;

        // Add new reminder to the according User
        await User.findByIdAndUpdate(userId, { $push: { reminders: reminderId }});
        const userEmail = (await User.findById(userId)).email;

        res.json({
            message: "Create reminder successfully"
        });
    }
    catch (e) {
        res.status(500).json({
            error: e.message,
            message: "Cannot create reminder"
        });
    }
}

async function getReminderById(req, res, next) {
    try {
        // Gather information of the reminder from API request
        const userId = req.userId;
        const reminderId = req.params.reminderId;
        const reminder = (await Reminder.findById(reminderId));

        if (!reminder) {
            res.status(404).json({
                message: "There's no such reminder"
            })
            return;
        }
        else if (userId !== reminder.user.toString()) {
            res.status(403).json({
                message: "You're not eligible to view this content"
            })
            return;
        }

        res.json(reminder);
    }
    catch (e) {
        res.status(500).json({
            error: e.message,
            message: "Cannot read reminder"
        });
    }

}

async function getReminderByUser(req, res, next) {
    try {
        // Gather information of the reminder from API request
        const userId = req.userId;
        const reminders = (await User.findById(userId)).reminders;

        if (!reminders) {
            res.status(401).json({ message: "UserId is wrong" });
            return;
        }

        let result = await Reminder.find().where('_id').in(reminders);

        res.json(result);
    }
    catch (e) {
        res.status(500).json({
            error: e.message,
            message: "Cannot read reminder"
        });
    }
}

async function updateReminder(req, res, next) {
    try {
        // Gather information of the reminder from API request
        const userId = req.userId;
        const updateReminder = req.body.reminder;
        const reminderId = updateReminder.reminderId;
        const prevReminder = await Reminder.findById(reminderId);

        let taskName = prevReminder.taskName;

        if (!prevReminder) {
            res.status(404).json({
                message: "There's no such reminder"
            });
            return;
        }
        else if (userId !== prevReminder.user.toString()) {
            res.status(403).json({
                message: "You're not eligible to edit this content"
            });
            return;
        }

        // Get the most updated information based on the current changes or the current values in DB
        let active;
        if (req.body.reminder.active) {
            active = req.body.reminder.active === "true";
        }
        else {
            active = prevReminder.active;
        }
        let recurring;
        if (req.body.reminder.recurring) {
            recurring = req.body.reminder.recurring === "true";
        }
        else {
            recurring = prevReminder.recurring;
        }

        const when = req.body.reminder.when || prevReminder.when;
        const title = req.body.reminder.title || prevReminder.title;
        const context = req.body.reminder.context || prevReminder.context;

        // Cancel the previous reminder
        cronSchedule.cancelJob(taskName);

        // Schedule another reminder if the update remains active
        if (active) {
             // Add new reminder to the according User
            const userEmail = (await User.findById(userId)).email;
            let schedule = when;
    
            // Handle schedule for the new reminder
            if (!recurring) {
                schedule = new Date(when);
            }

            const newTask = cronSchedule.scheduleJob(reminderId, schedule, function() {
                mailer(userEmail, title, context);
            })

            taskName = newTask.name;
        }

        await Reminder.findByIdAndUpdate(reminderId, {
            recurring: recurring,
            when: when,
            title: title,
            context: context,
            active: active,
            taskName: taskName
        });

        res.json({
            message: "Update reminder successfully"
        });
    }
    catch (e) {
        res.status(500).json({
            error: e.message,
            message: "Cannot edit reminder"
        });
    }
}

async function deleteReminder(req, res, next) {
    try {
        // Gather information of the reminder from API request
        const userId = req.userId;
        const updateReminder = req.body.reminder;
        const reminderId = updateReminder.reminderId;
        const prevReminder = await Reminder.findById(reminderId);

        if (!prevReminder) {
            res.status(404).json({
                message: "There's no such reminder"
            })
            return;
        }
        else if (userId !== prevReminder.user.toString()) {
            res.status(403).json({
                message: "You're not eligible to delete this content"
            })
            return;
        }

        await User.findByIdAndUpdate(userId, { $pull: { reminders: reminderId } });
        const deleteReminder = await Reminder.findByIdAndDelete(reminderId);

        // Cancel the deleted reminder if active
        if (deleteReminder.active) {
            cronSchedule.cancelJob(deleteReminder.taskName);
        }

        res.json({ message: "Delete reminder successfully" });
    }
    catch (e) {
        res.status(500).json({
            error: e.message,
            message: "Cannot delete reminder"
        });
    }
}

const reminderCtrl = {
    createReminder,
    getReminderById,
    getReminderByUser,
    updateReminder,
    deleteReminder
}

export default reminderCtrl;
