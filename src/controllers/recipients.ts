import * as express from "express";
import * as mysql from "mysql";
import dbConfig from "../db";

export const recipientsController: express.Router = express.Router();

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

recipientsController.get('/recipients', (_, res: express.Response): void => {

  res.header("Access-Control-Allow-Origin", "*");
  const connection = mysql.createConnection(dbConfig);

  connection.connect((err: any) => {
      if (err) throw err;

      connection.query('SELECT payload FROM events', (err: any, rows: Row[]) => {
          if (err) throw err;
          let results: RowParsed[] = payloadStringToJsObject(rows);
          let recipients: string[] = getRecipientIds(results);
          return res.status(200).json(recipients);
        });

      connection.end();
  });
});