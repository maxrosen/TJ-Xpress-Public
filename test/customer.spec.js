let chai = require("chai");
let chaiHttp = require("chai-http");
chai.use(chaiHttp);
// let app = require('../app.js');
let app = require("../app_test.js");
const { propfind } = require("../app.js");

// declare assertion style as 'should'
let should = require("chai").should();

describe("Customers", () => {
  describe("GET api/customers", () => {
    it("should return all customers", (done) => {
      chai
        .request(app)
        .get("/api/customers/")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("Array");
          done();
        });
    });

    // TODO
    it("should return error if no customers exist", () => {});
  });

  describe("GET api/customers/:id", () => {
    it("should get the specific customer associated with the id", (done) => {
      chai
        .request(app)
        .get("/api/customers/customer_id/6")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("Array");

          // object we get back from the db should be equal to testObj
          let testObj = {
            customer_id: 5,
            first_name: "John",
            middle_name: "Major",
            last_name: "Payne",
            phone: "2776521171",
            customer_notes: "",
            user_id: 10,
            state: "OR",
            city: "Portland",
            street: "Ashland Lane",
            house_number: 7,
            zip: "97203",
            country: "USA",
          };

          let resObj = res.body[0];
          //testObj.should.be.eql(resObj);
          done();
        });
    });

    it("should return an error if customer associated with the id doesn't exist", (done) => {
      chai
        .request(app)
        .get("/api/customers/customer_id/1000000")
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });
  });

  describe("POST api/customers", () => {
    const createRanPN = Math.random().toString().substr(2, 9);
    const createRanHN = Math.random().toString().substr(2, 3);
    const createRanZip = Math.random().toString().substr(2, 5);

    it("should create a new customer", (done) => {
      let create_customer = {
        first_name: "good",
        middle_name: " ",
        last_name: "doggo",
        phone: createRanPN,
        customer_notes: "give me a treat, I am a good doggo",
        user_id: 44,
        state: "MA",
        city: "Lowell",
        street: "Bruh Street",
        house_number: createRanHN,
        zip: createRanZip,
        country: "USA",
      };

      chai
        .request(app)
        .post("/api/customers")
        .send(create_customer)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it("should throw an error if user id is empty", (done) => {
      chai
        .request(app)
        .post("/api/customers")
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  describe("PATCH/api/customers/:id", () => {
    it("should return a 200/success if name is updated", (done) => {
      let customer_name = {
        first_name: "He",
        middle_name: " ",
        last_name: "Man",
      };

      chai
        .request(app)
        .patch("/api/customers/customer_id/2")
        .send(customer_name)
        .end((err, res) => {
          res.should.have.status(200);
          // res.body.should.have.property('customer updated')
          done();
        });
    });

    it("should return a 200/success if phone number is updated", (done) => {
      const randomPhoneNumber = Math.random().toString().substr(2, 9);
      let customer_phoneNumber = { phone: randomPhoneNumber };

      chai
        .request(app)
        .patch("/api/customers/customer_id/2")
        .send(customer_phoneNumber)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it("should return a 200/success if customer notes is updated", (done) => {
      chai
        .request(app)
        .patch("/api/customers/customer_id/2")
        .send({ customer_notes: "I SAID HEYYYYEAAAAAAAA" })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it("should return a 200/success if customer address is updated", (done) => {
      const randomHouseNumber = Math.random().toString().substr(2, 3);
      const randomZip = Math.random().toString().substr(2, 5);
      let customer_address = {
        state: "??",
        city: "He Man City",
        street: "He Man Street",
        house_number: randomHouseNumber,
        zip: randomZip,
        country: "HM",
      };

      chai
        .request(app)
        .patch("/api/customers/customer_id/2")
        .send(customer_address)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    // TODO
    it("should return an 500/error if the customer doesn't exist", (done) => {
      chai
        .request(app)
        .patch("/api/customers/customer_id/-15")
        .send({ customer_notes: "I should not exist" })
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });
  });
});
