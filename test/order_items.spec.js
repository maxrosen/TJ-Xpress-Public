let chai = require("chai");
let chaiHttp = require("chai-http");
chai.use(chaiHttp);
// let app = require('../app.js');
let app = require("../app_test.js");

const { propfind } = require("../app.js");

// declare assertion style as 'should'
let should = require("chai").should();

describe("Order_Items", () => {
  describe("GET api/order_items", () => {
    it("should return all order items", (done) => {
      chai
        .request(app)
        .get("/api/order_items/")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("Array");
          done();
        });
    });
    //TODO
    it("should return error if no order items exist", () => {});
  });

  describe("GET api/order_items/:id", () => {
    //TODO write another test to make sure order with multiple items return multiple order_items
    it("should get the specific order items associated with the id", (done) => {
      chai
        .request(app)
        .get("/api/order_items/order_id/3")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("Array");

          // object we get back from the db should be equal to testObj
          let testObj = {
            order_id: 3,
            product_id: 100003,
            product_quantity: 5,
            price: "54.95",
          };

          let resObj = res.body[2];
          testObj.should.be.eql(resObj);
          done();
        });
    });

    it("should return an error if the product associated with the id doesn't exist", (done) => {
      chai
        .request(app)
        .get("/api/order_items/order_id/-1")
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });
  });
  describe("POST api/order_items", () => {
    //DONE CHECK
    it("should add an item to order", (done) => {
      let order_items = {
        order_id: 11,
        product_id: 100283,
        product_quantity: 1,
        price: 10.99,
      };
      chai
        .request(app)
        .post("/api/order_items")
        .send(order_items)
        .end((err, res) => {
          // console.log(res)
          res.should.have.status(200);
          done();
        });
    });

    it("should send a 400 for no order item", (done) => {
      chai
        .request(app)
        .post("/api/order_items")
        .set("content-type", "JSON")
        //.send({})
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  describe("PATCH api/order_items/:id", () => {
    it("should return a 200 if quantity is updated", (done) => {
      chai
        .request(app)
        .patch("/api/order_items/order_id/13/product_id/100010")
        .send({ product_quantity: 1 })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    // THESE TESTS WONT WORK -- KEEP COMMENTED
    // it('should return a 200 if price is updated', (done) => {
    //     chai.request(app)
    //     .patch('/api/order_items/order_id/3/product_id/100003')
    //     .send({price: 29.99})
    //     .end((err, res) => {
    //         console.log(res)
    //         res.should.have.status(200)
    //         done()
    //     })
    // })

    // it('should return a 200 if quantity and price are updated', (done) => {
    //     chai.request(app).patch('/api/order/order_id/5/product_id/100003')
    //     .send({quantity: 10, price: 99.99})
    //     .end((err, res) => {
    //         res.should.have.status(200)
    //         done()
    //     })
    // })
  });

  describe("DELETE api/order_items", () => {
    // DONE CHECK
    // it('should DELETE the order item from the database', (done) => {
    //     chai.request(app)
    //     .delete('/api/order_items/order_id/1/product_id/1')
    //     .end((err, res) => {
    //         console.log(res)
    //         res.should.have.status(200)
    //         done()
    //     })

    // })

    it("should throw an error if the order item doesn't exist", (done) => {
      chai
        .request(app)
        .delete("/api/order_items/order_id/10000/product_id/10000")
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });
  });
});
