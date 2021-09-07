let chai = require("chai");
let chaiHttp = require("chai-http");
chai.use(chaiHttp);
// let app = require('../app.js');
let app = require("../app_test.js");

const { propfind } = require("../app.js");
const { order } = require("../routes/models/db.model.js");

// declare assertion style as 'should'
let should = require("chai").should();

/* 
Tests a full order flow, then deletes the order.
    START
    1. POST order to an existing customer
    2. GET order, in order to get the ID of the newly created order
    3. POST 2 order_items to the new order
    4. GET the order_items, verify that they were created
    5. DELETE the order, verify that the created order and order_items are deleted
    END 
*/

describe("Full order flow", () => {
  it("should POST an order to an existing customer", (done) => {
    let order = {
      customer_id: 3,
      status: "Draft",
      total_price: 1.0,
      notes: "Full flow order test",
      received: 0,
    };

    chai
      .request(app)
      .post("/api/order")
      .send(order)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  describe("GET the newly POSTed order", () => {
    let latest_order_id = 0;

    before((done) => {
      chai
        .request(app)
        .get("/api/order/customer_id/3")
        .end((err, res) => {
          latest_order_id = 0;
          res.body.forEach((element) => {
            if (element.order_id > latest_order_id) {
              latest_order_id = element.order_id;
            }
          });
          done();
        });
    });

    it("should GET the new order", (done) => {
      chai
        .request(app)
        .get("/api/order/order_id/" + latest_order_id.toString())
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe("POST 2 order_items to the newly created order, GET those orders, then DELETE the entire order", () => {
    let latest_order_id = 0;

    before((done) => {
      chai
        .request(app)
        .get("/api/order/customer_id/3")
        .end((err, res) => {
          latest_order_id = 0;
          res.body.forEach((element) => {
            if (element.order_id > latest_order_id) {
              latest_order_id = element.order_id;
            }
          });
          done();
        });
    });

    it("should POST the first new order_item to the order", (done) => {
      let order_items1 = {
        order_id: latest_order_id,
        product_id: 100374,
        product_quantity: 3,
        price: 10.99,
      };

      chai
        .request(app)
        .post("/api/order_items")
        .send(order_items1)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it("should POST the second new order_item to the order", (done) => {
      let order_items2 = {
        order_id: latest_order_id,
        product_id: 100376,
        product_quantity: 2,
        price: 10.99,
      };

      chai
        .request(app)
        .post("/api/order_items")
        .send(order_items2)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it("should GET the 2 order_items associated with the new order", (done) => {
      chai
        .request(app)
        .get("/api/order_items/order_id/" + latest_order_id.toString())
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("Array");
          let order_item_amount = res.body.length;
          order_item_amount.should.be.eql(2);
          done();
        });
    });

    it("should delete the order and associated order items", (done) => {
      chai
        .request(app)
        .delete("/api/order/order_id/" + latest_order_id.toString())
        .end((err, res) => {
          res.should.have.status(200);

          chai
            .request(app)
            .get("/api/order_items/order_id/" + latest_order_id.toString())
            .end((err, res) => {
              res.should.have.status(500);
            });

          chai
            .request(app)
            .get("/api/order/order_id/" + latest_order_id.toString())
            .end((err, res) => {
              res.should.have.status(500);
              done();
            });
        });
    });
  });
});
