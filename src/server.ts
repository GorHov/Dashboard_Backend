require('dotenv').config();
require('express-async-errors');
import express, { Express } from 'express';
import cors from 'cors';
import { userRouter } from './routes/userRoutes';
import errorHandler from './middleware/errorHandler';
import sequelize from './db/db';
import { productRouter } from './routes/productRoutes';
const cookieParser = require('cookie-parser')

const app: Express = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));


app.use('/api/auth', userRouter);
app.use('/api/', productRouter);
app.use(errorHandler);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(port, () =>
      console.log(`Server is running on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
