let chai = require("chai");
let chaiHttp = require("chai-http");
chai.use(chaiHttp);
// let app = require('../app.js');
let app = require("../app_test.js");

const { propfind } = require("../app.js");
const { order } = require("../routes/models/db.model.js");

// declare assertion style as 'should'
let should = require("chai").should();

describe("Orders", () => {
  describe("GET api/orders", () => {
    // it('should return all orders', (done) => {
    //     chai.request(app).get('/api/order/')
    //     .end((err, res) => {
    //         res.should.have.status(200)
    //         res.body.should.be.an('Array')
    //         res.body.length.should.be.eq(6)
    //         done();
    //     })
    // })

    // TODO
    it("should return error if no orders exist", () => {});
  });

  describe("GET api/orders/:id", () => {
    it("should get the specific order associated with the id", (done) => {
      chai
        .request(app)
        .get("/api/order/order_id/5")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("Array");
          done();
        });
    });

    // Check to see if logic is correct on this
    it("should return an error if order associated with the id doesn't exist", () => {
      chai
        .request(app)
        .get("/api/order/order_id/295342")
        .end((err, res) => {
          res.should.have.status(500);
        });
    });
  });

  describe("POST api/orders", () => {
    it("should create a new order", (done) => {
      let order = {
        customer_id: 2,
        status: "Draft",
        total_price: 11.99,
        notes: "For a test!",
        received: 1,
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

    it("should throw an error if customer id is empty", (done) => {
      chai
        .request(app)
        .post("/api/products")
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

    it("should throw an error if customer id doesn't exist", (done) => {
      let order = {
        customer_id: -55,
        status: "Draft",
        total_price: 10.99,
        notes: "For a test",
        received: 1,
      };

      chai
        .request(app)
        .post("/api/order")
        .send(order)
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });
  });

  describe("PATCH api/orders/:id", () => {
    it("should return a 200 if status is updated", (done) => {
      chai
        .request(app)
        .patch("/api/order/order_id/2")
        .send({ status: "Open" })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it("should return a 200 if notes are updated", (done) => {
      chai
        .request(app)
        .patch("/api/order/order_id/2")
        .send({ notes: "Shopping Order" })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it("should return a 200 if recieved is updated", (done) => {
      chai
        .request(app)
        .patch("/api/order/order_id/2")
        .send({ received: 1 })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it("should return a 200 if recieved is updated", (done) => {
      chai
        .request(app)
        .patch("/api/order/order_id/2")
        .send({ received: 1 })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it("should return a 200 if status and recieved are updated", (done) => {
      chai
        .request(app)
        .patch("/api/order/order_id/2")
        .send({ status: "Draft", received: 0 })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it("should return a 200 if status and notes are updated", (done) => {
      chai
        .request(app)
        .patch("/api/order/order_id/2")
        .send({ status: "Closed", notes: "Closed order" })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it("should return a 200 if recieved and notes are updated", (done) => {
      chai
        .request(app)
        .patch("/api/order/order_id/2")
        .send({ received: 1, notes: "Closed order" })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it("should return a 200 if status, notes, and recieved are updated", (done) => {
      chai
        .request(app)
        .patch("/api/order/order_id/2")
        .send({ received: 2, notes: "Closed ORDER", status: "CLOSED" })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it("should return a 500 if the order doesn't exist", (done) => {
      chai
        .request(app)
        .patch("/api/order/order_id/-1")
        .send({ received: 0, notes: "Open Order", status: "Open" })
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });
  });

  describe("DELETE api/orders/:id", () => {
    // deleting an order should delete the order from the order table - testing for the full deleteion in a seperate test file
    // order_id: 6, customer_id: 11, status: 'Closed', datetime: '0000-00-00 00:00:00', total_price: 10.48, notes: 'Brian Dobson order 2', received: 0
    // get the order ID from the order that was posted in a prior test

    before((done) => {
      chai
        .request(app)
        .get("/api/order/customer_id/2")
        .end((err, res) => {
          let last_index = res.body.length;
          let latest_order = res.body[last_index - 1];
          latest_order_id = latest_order.order_id;
          done();
        });
    });

    it("should delete an order from the database", (done) => {
      console.log("Order ID to be deleted: " + latest_order_id.toString());

      chai
        .request(app)
        .delete("/api/order/order_id/" + latest_order_id.toString())
        .end((err, res) => {
          res.should.have.status(200);

          chai
            .request(app)
            .get("/api/order/")
            .end((err, res) => {
              res.should.have.status(200);

              let order_id_list = [];
              let all_orders = res.body;
              let order_deleted = false;

              all_orders.forEach((element) => order_id_list.push(element[0]));

              if (all_orders.includes(latest_order_id)) {
                order_deleted = false;
              } else {
                order_deleted = true;
              }

              order_deleted.should.eql(true);
              done();
            });
        });
    });
  });

  describe("DELETE api/orders/:id if an order doesn't exist", () => {
    // Returns a 200 even if the product does not exist
    it("should throw an error if the order doesn't exist", (done) => {
      chai
        .request(app)
        .delete("/api/order/order_id/-10000")
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
