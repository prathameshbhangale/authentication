import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import cors from 'cors';
import userRoutes from "./routes/auth.js"


dotenv.config()

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
    origin: '*', // You can restrict to specific domains here
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions)); 
app.use(express.json());
connectDB()

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/auth', userRoutes);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});