// cards.test.js

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server'); // Adjust if your server export is different

chai.should();
chai.use(chaiHttp);

describe('Cards API', () => {

  // Test GET /cards
  it('should GET all the cards', (done) => {
    chai.request(server)
      .get('/cards')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();
      });
  });

});
