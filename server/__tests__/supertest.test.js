import supertest from 'supertest';

const PORT = process.env.PORT || 4000;
const server = `http://localhost:${PORT}`;

/**
 * Docs: https://www.npmjs.com/package/supertest
 */

// test routes
describe('Route integration', () => {
  describe('/', () => {
    describe('GET', () => {
      // Note that we return the evaluation of `request` here! It evaluates to
      // a promise, so Jest knows not to say this test passes until that
      // promise resolves. See https://jestjs.io/docs/en/asynchronous
      it('responds with 200 status and text/html content type', () => {
        return request(server)
          .get('/')
          .expect('Content-Type', /text\/html/)
          .expect(200);
      });
    });
  });

  describe('/markets', () => {
    describe('GET', () => {
      it('responds with 200 status and application/json content type', () => {
        return request(server)
          .get('/markets')
          .expect('Content-Type', /json/)
          .expect(200);
      });

      // For this test, you'll need to inspect the body of the response and
      // ensure it contains the markets list. Check the markets.dev.json file
      // in the dev database to get an idea of what shape you're expecting.
      it('markets from "DB" json are in body of response', () => {
        const response = request(server).get('/markets');
        expect(response.headers['Content-Type']).toMatch(/json/);
        // expect(response.body).toEqual([]);
      });
    });

    describe('PUT', () => {
      xit('responds with 200 status and application/json content type', () => {});

      xit('responds with the updated market list', () => {});

      xit('responds to invalid request with 400 status and error message in body', () => {});
    });
  });
});
