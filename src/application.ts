import * as express from "express";

// 2 ON THE END SIGNIFIES NEW CONTROLLERS
// IF FIRST ONE IS A 2 THEN APP CRASHES
// THERFORE CAN'T BOTH BE NEW CONTROLLER

import {observationsController} from './controllers/observations2';
import {recipientsController} from "./controllers/recipients2";

const app = express();

app.use(recipientsController);
app.use(observationsController);

export default app;
