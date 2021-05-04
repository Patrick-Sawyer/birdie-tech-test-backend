import * as express from "express";

import {observationsController} from './controllers/observations';
import {recipientsController} from "./controllers/recipients2";

const app = express();

app.use(recipientsController);
app.use(observationsController);

export default app;
