import express from "express";
import cors from 'cors';
import UserRouter from './routes/UserRoute.js';
import ProductRouter from './routes/ProductRoute.js';
import db from './config/database.js';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

dotenv.config();
const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:3000'}));
app.use(cookieParser());
app.use(express.json());
// product
app.use(fileUpload());
app.use(express.static('public'));

app.use(UserRouter);
app.use(ProductRouter);

app.listen(process.env.PORT, ()=> console.log('Server is running on port', process.env.PORT));

async function connectionTest () {
    try {
        await db.authenticate();
        console.log('Connected');
        // await db.sync();
    } catch (error) {
        console.error('Failed connected : ', error);
    }
}
connectionTest();