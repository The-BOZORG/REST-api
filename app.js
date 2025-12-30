import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//middlewares
import notFound from './middlewares/notFound.js';
import errorHandler from './middlewares/errorHandler.js';

//route
import authRoute from './routers/authRoute.js';
import userRoute from './routers/userRoute.js';
import pageRoute from './routers/pageRoute.js';

//pakages
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

//dababase
import connectDB from './config/connectDB.js';
connectDB();

//view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public', 'views'));

//cors configuration - must be before routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

//helper
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser(process.env.JWT_COOKIE_SECRET));
app.use(express.urlencoded({ extended: false }));

//serve static files
app.use(express.static(path.join(__dirname, 'public')));

//router
app.use('/', pageRoute);
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);

app.use(notFound);
app.use(errorHandler);

//server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
