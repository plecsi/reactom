import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
//import helmet from 'helmet';
import dotenv from 'dotenv';
import Routings from './routing/index.ts';



dotenv.config();

const app = express();

//app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: `http://localhost:4200`, // vagy ahonnan a front kéri, '*' fejlesztés alatt, de prod-ban inkább konkrét domaint adj meg
  credentials: true, // Ha cookie-t, authorization header-t is küldesz
}));
// Routes
/*app.use('/auth', authController);
app.use('/user', userController);*/
Routings(app)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Auth backend running on ${PORT}`));

export default app;
