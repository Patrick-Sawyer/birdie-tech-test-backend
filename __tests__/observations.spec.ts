/// <reference types="jest" />

import app from '../src/application'
import * as request from 'supertest';

const recipientId: string = 'df50cac5-293c-490d-a06c-ee26796f850d';

describe('Observations endpoint', () => {

  it('returns status code 200', async () => {
    const test = await request(app)
      .get('/observations')
      .expect(200)
  });

  describe('when only recipient id given', () => {

    it('returns status code 200', async () => {
        await request(app)
          .get('/observations?recipient=' + recipientId)
          .expect(200)
    });

    let res: any;

    beforeEach(async () => {
      res = await request(app)
      .get('/observations?recipient=' + recipientId) 
    });

    it('returns array with length greater than 20 when no page or type given', async () => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(20);
    });

    it('first 5 objects in array have valid timestamps strings', async () => {
        for(let i = 0; i < 5; i++){
            expect(typeof res.body[i].timestamp).toBe('string');
            let date = new Date(res.body[i].timestamp);
            expect(date.toString()).not.toBe('Invalid Date');
        }
    });

    //expect structure of response to be correct

  })

  describe('when count given as true', () => {

    let res: any;

    beforeEach(async () => {
      res = await request(app)
      .get('/observations?recipient=' + recipientId + '&count=true') 
    });

    it('returns object', async () => {
        expect(typeof res.body).toBe('object');
    });

    it('returns object with numbers for all values', async () => {
      for(const key in res.body){
        expect(typeof res.body[key]).toBe('number')
      }
    })
  })

  describe('when page given', () => {
    let res1: any;

    beforeEach(async () => {
      res1 = await request(app)
      .get('/observations?recipient=' + recipientId + '&page=0') 
    });

    it('returns array of length 20 when page given', async () => {
      expect(Array.isArray(res1.body)).toBe(true);
      expect(res1.body.length).toEqual(20);
    });

    it('should have completely different observations when different pages given', async () => {
      const res2 = await request(app)
      .get('/observations?recipient=' + recipientId + '&page=1')
      for(let i = 0; i < 20; i++){
        for(let j = i; j < 20; j++){
          expect(res1.body[i]).not.toEqual(res2.body[j])
        }
      }
    })
  })

  describe('when type given', () => {
    let res: any;

    beforeEach(async () => {
      res = await request(app)
      .get('/observations?recipient=' + recipientId + '&type=regular_medication_taken')
      console.log(res.body[0])
    });
  })
});
