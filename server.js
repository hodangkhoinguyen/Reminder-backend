import express from 'express';
import cors from 'cors';
import {authRoute, studentRoute, tutorRoute, appointmentRoute} from './route/index.js';
import cookieParser from 'cookie-parser';

const app = express();
const corsOptions = {
    origin: true, //included origin as true
    credentials: true, //included credentials as true
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/auth", authRoute);

app.use("*", (req, res) => res.status(404).json({err: "URL not found"}));
export default app;
