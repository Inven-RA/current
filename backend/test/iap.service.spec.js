let chai;
import('chai').then(chai2 => {
  chai = chai2;
  const chaiHttp = require("chai-http");  

  chai.use(chaiHttp);

  console.log(chai);
});

const { ServiceBroker } = require("moleculer");
const iapService = require("../services/iap.service");

const broker = new ServiceBroker();
broker.createService(iapService);

describe("IAP Service", () => {
  before(async () => {
    await import("chai").then((result) => {
      chai = result;
      chai.use(chaiHttp);
      chai.should();
    });
    await broker.start();
  });

  after(async () => {
    await broker.stop();
  });

  describe("create method", () => {
    it("should create a new IAP", async () => {
      console.log(chai)
      const res = await chai
        .request(broker)
        .post("/iap/create")
        .send({ name: "Test IAP" });
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("_id");
      expect(res.body.name).to.equal("Test IAP");
    });
  });

  describe("get method", () => {
    it("should get an existing IAP by ID", async () => {
      const createRes = await chai
        .request(broker)
        .post("/iap/create")
        .send({ name: "Test IAP" });
      const iapId = createRes.body._id;
      const getRes = await chai.request(broker).get(`/iap/${iapId}`);
      expect(getRes).to.have.status(200);
      expect(getRes.body).to.have.property("_id");
      expect(getRes.body._id).to.equal(iapId);
    });

    it("should return 404 when trying to get a non-existing IAP", async () => {
      const res = await chai.request(broker).get("/iap/nonexistingid");
      expect(res).to.have.status(404);
    });
  });

  describe("list method", () => {
    it("should list all available IAPs", async () => {
      const res = await chai.request(broker).get("/iap");
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
    });
  });
});
