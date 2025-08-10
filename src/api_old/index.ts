import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import subscribeToRouter from './routing/index.ts';


const app = express();
const port = 3000;

app.use(cors({
  origin: `http://localhost:4200`, // vagy ahonnan a front kéri, '*' fejlesztés alatt, de prod-ban inkább konkrét domaint adj meg
  credentials: true, // Ha cookie-t, authorization header-t is küldesz
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


subscribeToRouter(app);

app.listen(3000, () => {
    console.log(`Listening on port ${port}`);
});