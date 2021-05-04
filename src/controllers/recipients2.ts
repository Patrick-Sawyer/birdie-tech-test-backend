import * as express from "express";
const db = require('../database');

// INTERFACEES

interface RowParsed {
  payload: {
    event_type: string;
    note: string;
    mood: string;
    task_schedule_note: string;
    task_definition_description: string;
    observed: string;
    fluid: string;
    care_recipient_id: string;
  };
}

interface Row {
  payload: string;
  timestamp: string;
}

// ABSTRACTED FUNCTIONS FOR SORTING DATA

const payloadStringToJsObject = (rows: Row[]): RowParsed[] => {
  return rows.map((row: Row) => {
    return {
      payload: JSON.parse(row.payload),
      timestamp: row.timestamp
    }
  })
}

const getRecipientIds = (results: RowParsed[]): string[] => {
  let array: string[] = [];
  results.forEach((observation: RowParsed) => {
    let id: string = observation.payload.care_recipient_id;
    if(!array.includes(id)){
      array.push(id)
    }
  })
  return array;
}

// ENDPOINT

export const recipientsController: express.Router = express.Router();

recipientsController.get('/recipients', (_, res: express.Response): void => {
  
  res.header("Access-Control-Allow-Origin", "*");

  db.query('SELECT payload FROM events', (err: boolean, rows: Row[]) => {
    if (err) throw err;
    let results: RowParsed[] = payloadStringToJsObject(rows);
    let recipients: string[] = getRecipientIds(results);
    return res.status(200).json(recipients);
  })
});
