import express from 'express';
const app = express();

//middlewares
import notFound from './middlewares/notFound.js';
import errorHandler from './middlewares/errorHandler.js';

//route
import authRoute from './routers/authRoute.js';
import userRoute from './routers/userRoute.js';

//pakages
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

//dababase
import connectDB from './config/connectDB.js';
connectDB();

//helper
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser(process.env.JWT_COOKIE_SECRET));
app.use(express.urlencoded({ extended: false }));

//router
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);

app.use(notFound);
app.use(errorHandler);

//server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
