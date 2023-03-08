import express from 'express';
import morgan from 'morgan';
import { AppDataSource } from './data-source';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import subRoutes from './routes/subs';
import postRoutes from './routes/posts';
import voteRoutes from './routes/votes';

dotenv.config();

const app = express();
const origin = 'http://localhost:3000';
app.use(cors({
    origin,
    credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

app.get('/', (_, res) => res.send('running'));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subs', subRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/votes', voteRoutes);

app.use(express.static('public'));

let port = 8000;
app.listen(port, async () => {
    console.log(`🚀 server running at http://localhost:${port}`);

    AppDataSource.initialize().then(async () => {
        console.log('data initialized');
    }).catch(error => console.log(error));
});

