import express from 'express';
import notesRoutes from './src/routes/noteroutes.js';
import connectDB from './src/config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();


const app = express();

app.use(express.json());
app.use(cors ({
    // origin: 'https://tboard-fe.vercel.app/dashboard',
    // origin: 'http://localhost:3000/api/notes',
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    // allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true

}))
const PORT = process.env.PORT || 3000;


app.use("/api/notes", notesRoutes)

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});