import express from 'express';
import morgan from 'morgan';
import {AppDataSource} from './data-source';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth';
import subRoutes from './routes/subs';

const app = express();
const origin = 'http://localhost:3000';
app.use(cors({
    origin,
    credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

dotenv.config();

app.get('/', (_, res) => res.send('running'));
app.use('/api/auth', authRoutes);
app.use('/api/subs', subRoutes);

let port = 8000;
app.listen(port, async () => {
    console.log(`server running at http://localhost:${port}`);

    AppDataSource.initialize().then(async () => {
        console.log('data initialized');
    }).catch(error => console.log(error));
});
