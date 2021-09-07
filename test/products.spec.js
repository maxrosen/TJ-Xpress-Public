let chai = require("chai");
let chaiHttp = require("chai-http");
chai.use(chaiHttp);
// let app = require('../app.js');
let app = require("../app_test.js");

const { propfind } = require("../app.js");

// declare assertion style as 'should'
let should = require("chai").should();

describe("Products", () => {
  describe("GET api/products", () => {
    it("should return all products", (done) => {
      chai
        .request(app)
        .get("/api/products/")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("Array");
          done();
        });
    });

    //TODO
    it("should return error if no products exist", () => {});
  });

  describe("GET api/products/product_id/:id", () => {
    it("should get the specific product associated with the id", (done) => {
      chai
        .request(app)
        .get("/api/products/product_id/1")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("Array");
          done();
        });
    });

    it("should return an error if the product associated with the id doesn't exist", (done) => {
      chai
        .request(app)
        .get("/api/products/product_id/-333333")
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });
  });

  describe("POST api/post/product", () => {
    //TODO
    it("should create a product", (done) => {
      const randomSKU = Math.random().toString(16).substr(2, 8);
      let product = {
        sku: randomSKU,
        price: 10.99,
        name: randomSKU,
        total_quantity: 22,
        description: "For a test",
      };

      chai
        .request(app)
        .post("/api/products")
        .send(product)
        .end((err, res) => {
          //console.log(res)
          res.should.have.status(200);
          done();
        });
    });

    it("should send a 400 for no product", (done) => {
      chai
        .request(app)
        .post("/api/products")
        .set("content-type", "JSON")
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  describe("PATCH api/products/product_id/:id", () => {
    //DONE
    it("should ensure quantity changes when prompted", (done) => {
      chai
        .request(app)
        .patch("/api/products/product_id/13")
        .send({ total_quantity: 20 })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("message");
          done();
        });
    });
    //DONE
    it("should return 500 error if the product doesn't exist", (done) => {
      chai
        .request(app)
        .patch("/api/products/product_id/-20")
        .send({ total_quantity: 57 })
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });
  });
});
