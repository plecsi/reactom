import express from 'express';
import bodyParser from 'body-parser';
import subscribeToRouter from './routing/index.js';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

subscribeToRouter(app);

app.listen(3000, () => {
    console.log(`Listening on port ${port}`);
});