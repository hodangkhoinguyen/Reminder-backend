import mongoose from 'mongoose';
import dotenv from "dotenv";
import app from "./server.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.CANVAS_DB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(
    app.listen(PORT, ()=> {
        console.log(`listening on port ${PORT}`);
    })
)
.catch((err)=> {
    console.log(`cannot connected, error happened: ${err}`);
})
