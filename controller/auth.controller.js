import dotenv from "dotenv";
import db from "../model/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

dotenv.config();

const User = db.user;

const HASH_TIME = 12;

async function signUp(req, res, next) {
    try {
        // Generate a random 32-bit string for salt
        const salt = crypto.randomBytes(64).toString('hex');
        const hashPassword = bcrypt.hashSync(salt + req.body.password, HASH_TIME);

        let roles = req.body.roles;

        if (!roles || roles.length === 0) {
            roles = ["student"];
        }

        const user = new User({
            email: req.body.email,
            password: hashPassword,
            salt: salt,
            name: req.body.name,
            reminders: []
        });

        await user.save();
        res.send({ message: "register successfully!" });
    }
    catch (e) {
        res.status(500).send({ message: "sign up fails" });
    }
}

async function signIn(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    let user = await User.findOne({
        email: email
    }).select("+salt +password");
    if (user === null) {
        res.status(505).json({ message: "This email doesn't exist" });
        return;
    };
    const passwordIsValid = bcrypt.compareSync(
        user.salt + password,
        user.password
    );

    if (!passwordIsValid) {
        res.status(401).json({
            accessToken: null,
            message: "Invalid Password!"
        });
        return
    }

    var token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET);

    res.json({
        userId: user._id,
        name: user.name,
        email: user.email,
        accessToken: token
    });
}

const authCtrl = {
    signUp,
    signIn
}

export default authCtrl;
