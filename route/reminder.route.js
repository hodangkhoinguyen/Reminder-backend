import express from 'express';
import reminderCtrl from '../controller/reminder.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.route("/").post(auth.verifyToken, reminderCtrl.createReminder)
    .get(auth.verifyToken, reminderCtrl.getReminderByUser)
    .put(auth.verifyToken, reminderCtrl.updateReminder)
    .delete(auth.verifyToken, reminderCtrl.deleteReminder);

router.route("/:reminderId", auth.verifyToken, reminderCtrl.getReminderById);

export default router;
