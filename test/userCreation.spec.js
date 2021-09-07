let chai = require("chai");
let chaiHttp = require("chai-http");
chai.use(chaiHttp);
// let app = require('../app.js');
let app = require("../app_test.js");

const { propfind } = require("../app.js");

let should = require("chai").should();

describe("Test chain for user creation", () => {
  describe("POST api/logins", () => {
    it("should add a login information", (done) => {
      const randomPassword = Math.random().toString(16).substr(2, 16);
      const randomUsername = Math.random().toString(16).substr(2, 8);

      let login = {
        email: randomUsername + "@yahoo.com",
        username: randomUsername,
        password: randomPassword,
        role: "customer",
      };

      chai
        .request(app)
        .post("/api/logins")
        .send(login)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe("POST api/customers", () => {
    const randomPhoneNumber = Math.random().toString().substr(2, 9);
    const randomHouseNumber = Math.random().toString().substr(2, 3);
    const randomZip = Math.random().toString().substr(2, 5);

    let newCustomer = {
      first_name: "PLEASEFORTHELOVEOFGODDELETE",
      middle_name: "h",
      last_name: "le",
      phone: randomPhoneNumber,
      customer_notes: "this is a test ignore me",
      user_id: 0,
      state: "MA",
      city: "Lowell",
      street: "Bruh Street",
      house_number: randomHouseNumber,
      zip: randomZip,
      country: "USA",
    };

    before((done) => {
      chai
        .request(app)
        .get("/api/logins/")
        .end((err, res) => {
          newCustomer.user_id = res.body[res.body.length - 1].user_id;
          done();
        });
    });

    it("should create a customer", (done) => {
      chai
        .request(app)
        .post("/api/customers")
        .send(newCustomer)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.user_id.should.eq(newCustomer.user_id);
          done();
        });
    });
  });

  describe("POST api/order", () => {
    let order = {
      customer_id: 0,
      status: "Draft",
      total_price: 0,
      notes: "Order for Hugh!",
      received: 0,
    };

    before((done) => {
      chai
        .request(app)
        .get("/api/customers")
        .end((err, res) => {
          order.customer_id = res.body[res.body.length - 1].customer_id;
          done();
        });
    });

    it("should create a new order for the customer created by the login", (done) => {
      chai
        .request(app)
        .post("/api/order")
        .send(order)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.customer_id.should.eq(order.customer_id);
          done();
        });
    });
  });

  describe("POST api/order_items", () => {
    let order_items = {
      order_id: 0,
      product_id: 100283,
      product_quantity: 1,
    };

    before((done) => {
      chai
        .request(app)
        .get("/api/order")
        .end((err, res) => {
          order_items.order_id = res.body[res.body.length - 1].order_id;
          done();
        });
    });

    it("should add an item to the order made for the customer", (done) => {
      chai
        .request(app)
        .post("/api/order_items")
        .send(order_items)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.order_id.should.eq(order_items.order_id);
          done();
        });
    });
  });

  //169+
  describe("DELETE api/logins/user_id/:id", () => {
    let login_id = 0;
    before((done) => {
      chai
        .request(app)
        .get("/api/logins/")
        .end((err, res) => {
          login_id = res.body[res.body.length - 1].user_id;
          done();
        });
    });

    it("should remove a customer from the database", (done) => {
      chai
        .request(app)
        .delete("/api/logins/user_id/" + login_id.toString())
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
