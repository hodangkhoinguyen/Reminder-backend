import express from 'express';
import authCtrl from '../controller/auth.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.route("/signin").post(authCtrl.signIn);
router.route("/signup").post(auth.checkDuplicateEmail, authCtrl.signUp);

export default router;
