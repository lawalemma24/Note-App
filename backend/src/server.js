import express from 'express';
import notesRoutes from './routes/noteroutes.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();


const app = express();

app.use(express.json());
app.use(cors ({
    origin: 'http://localhost:5173',
}))
const PORT = process.env.PORT || 3000;


app.use("/api/notes", notesRoutes)

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});