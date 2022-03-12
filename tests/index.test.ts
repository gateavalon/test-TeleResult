import request from "supertest";
import { createApp, orderList } from "../index";

describe("test on restful API", function () {
  let app: any;

  beforeAll(async () => {
    app = await createApp();
  });

  it("should return successfully", async () => {
    const res = await request(app).get("/orders").send();
    expect(res.statusCode).toEqual(200);
  });

  it("should return order list", async () => {
    const res = await request(app).get("/orders").send();
    expect(res.body).toMatchObject(orderList);
  });

  it("should return correct response type", async () => {
    const res = await request(app).get("/orders/1").send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("title");
    expect(res.body).toHaveProperty("date");
    expect(res.body).toHaveProperty("type");
    expect(res.body).toHaveProperty("customer");

    expect(typeof res.body.id).toBe("string");
    expect(typeof res.body.title).toBe("string");
    expect(typeof res.body.date).toBe("string");
    expect(typeof res.body.type).toBe("string");
    expect(typeof res.body.customer).toBe("string");
  });

  it("should not return response when input is invalid", async () => {
    const res = await request(app).get("/orders/7").send();
    expect(res.body).toBe("");
  });

  it("should return order with type and date", async () => {
    const res = await request(app).get("/orders/iPhone14/20181022").send();
    expect(res.body).toMatchObject({
      type: "iPhone14",
      count: 1,
      orders: ["5"],
      related_customers: ["customer-5"],
    });
  });

  it("should return error with wrong type or date", async () => {
    const res = await request(app).get("/orders/iPhone14/20200101").send();
    expect(res.body).toMatchObject({
      message: "no order found",
    });
  });

  it("should return correct ordes when post is done", async () => {
    const orderPost = {
      id: "6",
      title: "new MacBook order",
      date: "2020-01-15",
      type: "macBook1",
      customer: "customer-7",
    };
    const res = await request(app).post("/orders").send(orderPost);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchObject({
      id: "6",
      title: "new MacBook order",
      date: "2020-01-15",
      type: "macBook1",
      customer: "customer-7",
    });
  });

  it("should return error when the posting order id is already in the order list", async () => {
    const orderPost = {
      id: "1",
      title: "new MacBook order",
      date: "2020-01-15",
      type: "macBook1",
      customer: "customer-7",
    };
    const res = await request(app).post("/orders").send(orderPost);
    expect(res.body).toMatchObject({
      message: "order already exists",
    });
  });
});
