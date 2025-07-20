import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import passport from 'passport'; // <-- Import passport
import configurePassport from './config/passport.js'; // <-- Import our passport config
import { notFound, errorHandler } from './middleware/errorMiddleware.js';


import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import quizRoutes from './routes/quizRoutes.js';


import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

configurePassport(); 


const app = express();


app.use(cors());
app.use(express.json());


app.use(passport.initialize());


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);

app.get('/api', (req, res) => {
    res.send('SmartQuiz API is running...');
});


app.use(notFound);
app.use(errorHandler);

export default app;