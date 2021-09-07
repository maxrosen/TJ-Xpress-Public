let chai = require("chai");
let chaiHttp = require("chai-http");
chai.use(chaiHttp);
// let app = require('../app.js');
let app = require("../app_test.js");

const { propfind } = require("../app.js");

// declare assertion style as 'should'
let should = require("chai").should();

describe("Logins", () => {
  describe("GET api/logins", () => {
    it("should return all logins", (done) => {
      chai
        .request(app)
        .get("/api/logins/")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("Array");
          done();
        });
    });

    it("should return error if no logins exist", () => {});
  });

  describe("POST api/post/logins", () => {
    //it('should add a login information', (done) => {

    // const randomPassword = Math.random().toString(16).substr(2, 16);

    // let login = {email: "OmniMan@yahoo.com",
    // username: "H@T!1k",
    // password: randomPassword,
    // role: "customer"}

    // chai.request(app).post('/api/logins')
    // .send(login)
    // .end((err, res) => {
    //     res.should.have.status(200);
    //     done()
    // })
    // })

    it("should send a 400 for no login", (done) => {
      chai
        .request(app)
        .post("/api/logins")
        .set("content-type", "JSON")
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  describe("DELETE api/login/:id", () => {
    it("should remove a customer from the database", (done) => {
      chai
        .request(app)
        .delete("/api/logins/user_id/224")
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    /**
     * Possibly add a prompt if user has active orders
     */

    it("should throw an error if the user doesn't exist", (done) => {
      chai
        .request(app)
        .delete("/api/logins/user_id/100000")
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
