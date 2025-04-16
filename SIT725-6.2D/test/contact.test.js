// contact.test.js

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server'); // Adjust if your server export is different

chai.should();
chai.use(chaiHttp);

describe('Contact Form API', () => {

  // Test POST /submit-form
  it('should POST contact form data', (done) => {
    const contact = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message'
    };

    chai.request(server)
      .post('/submit-form')
      .send(contact)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.message.should.eql('Form submitted successfully!');
        done();
      });
  });

});
