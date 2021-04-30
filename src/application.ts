import * as express from "express";
import {observationsController} from "./controllers/observations";
import {recipientsController} from "./controllers/recipients";

const app = express();

app.use(observationsController);
app.use(recipientsController);

export default app;
