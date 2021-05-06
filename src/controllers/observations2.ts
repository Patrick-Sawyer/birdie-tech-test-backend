import * as express from "express";
import databaseQuery from '../database';

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
  timestamp: string;
}

interface RowModified {
  note: string;
  mood: string;
  timestamp: string;
  taskNote: string;
  taskDefinition: string;
  fluidsObserved: string;
  fluidType: string;
}

interface Row {
  payload: string;
  timestamp: string;
}

interface Count { 
  [key: string]: number; 
}

interface Query {
  recipient: string;
  page: string;
  type: string; 
  count: boolean;
  patients: boolean;
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

const getObservationCounts = (rows: RowParsed[]): Count => {
  let observationCount: Count = {};
  rows.forEach((row: RowParsed) => {
      let type: string = row.payload.event_type;
      if(type in observationCount){
        observationCount[type]++;
      }else{
        observationCount[type] = 1;
      }
  })
  return observationCount;
}

const filterByType = (results: RowParsed[], type: string): RowParsed[] => {
  return results.filter((row: RowParsed) => {
    return row.payload.event_type == type
  })
}

const getPage = (results: RowParsed[], page: string) => {
  let pageNumber: number = parseInt(page);
  let firstRow: number = 20 * pageNumber; 
  return results.slice(firstRow, firstRow + 20);
}

const structureDataForResponse = (results: RowParsed[]): RowModified[] => {
  return results.map((row: RowParsed) => {
    return {
      note: row.payload.note,
      mood: row.payload.mood,
      timestamp: row.timestamp,
      taskNote: row.payload.task_schedule_note,
      taskDefinition: row.payload.task_definition_description,
      fluidsObserved: row.payload.observed,
      fluidType: row.payload.fluid
    }
  })
}

// ENDPOINT

export const observationsController: express.Router = express.Router();

observationsController.get('/observations', (req: express.Request<{},{},{}, Query>, res: express.Response): void => {
  
  res.header("Access-Control-Allow-Origin", "*");
  const { recipient, page, type, count } = req.query;
  let recipientQuery: string = recipient ? ' WHERE care_recipient_id="' + recipient + '"' : '';
  let queryString: string = 'SELECT payload, timestamp FROM events' + recipientQuery + ' ORDER BY timestamp DESC';

  databaseQuery(queryString, (err: boolean, rows: Row[]) => {
    if (err) return res.status(500).json({error: 'error'});

    let results: RowParsed[] = payloadStringToJsObject(rows);

    if(count){
      let observationCount: Count = getObservationCounts(results);
      return res.status(200).json(observationCount);
    }
    
    if(type){
      results = filterByType(results, type);
    }
    
    if(page){
      results = getPage(results, page);
    }

    let modified: RowModified[] = structureDataForResponse(results);

    return res.status(200).json(modified);
  })
});
