import jwt from "jsonwebtoken";
import db from "../model/index.js";
import dotenv from "dotenv";

dotenv.config();

const User = db.user;

async function verifyToken(req, res, next) {
    try {
        let token = req.headers["x-access-token"];
    
        if (!token) {
            return res.status(403).send({ message: "No token provided!" });
        }
    
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send({ message: "Unauthorized!" });
            }
    
            req.userId = decoded.id;
            next();
        })
    }
    catch (e) {
        res.status(500).send({ message: "verify token fails" });
    }
}

async function checkDuplicateEmail(req, res, next) {
    try {
        const user = await User.findOne({
            email: req.body.email
        });
    
        if (user) {
            res.status(400).send({ message: `Failed! Email is already used!` });
            return;
        }
        next();
    }
    catch (e) {
        res.status(500).send({ message: "check duplicate email fails" });
    }
}

const auth = {
    verifyToken,
    checkDuplicateEmail
}

export default auth;
