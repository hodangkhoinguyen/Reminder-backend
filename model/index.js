import mongoose from 'mongoose';
import Reminder from './reminder.model.js';
import User from './user.model.js';

const db = {};
db.mongoose = mongoose;
db.reminder = Reminder;
db.user = User;

export default db;
