import cors from "cors";
import express from "express";

const port = 4000;

export interface orderListType {
  id: string;
  title: string;
  date: string;
  type: string;
  customer: string;
}

export interface orderQueryType {
  type: string;
  count: number;
  orders: string[];
  related_customers: string[];
}

export const orderList: orderListType[] = [
  {
    id: "1",
    title: "new mobile order",
    date: "2016-09-22",
    type: "iPhone13",
    customer: "customer-1",
  },
  {
    id: "2",
    title: "new mobile order",
    date: "2016-09-22",
    type: "iPhone13",
    customer: "customer-2",
  },
  {
    id: "3",
    title: "new mobile order",
    date: "2016-10-22",
    type: "iPhone15",
    customer: "customer-3",
  },
  {
    id: "4",
    title: "new mobile order",
    date: "2017-10-22",
    type: "iPhone13",
    customer: "customer-1",
  },
  {
    id: "5",
    title: "new mobile order",
    date: "2018-10-22",
    type: "iPhone14",
    customer: "customer-5",
  },
];

export const createApp = async () => {
  // create express app
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(express.urlencoded({ extended: false }));

  // setup routes for find all orders to check if all orders could be shown correctly
  app.get("/orders", (req, res) => {
    try {
      res.send(orderList);
    } catch (error) {
      console.log(error);
    }
  });

  // setup routes for finding order by ID
  app.get("/orders/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const result = orderList.find((order: orderListType) => order.id === id);
      res.status(200).json(result);
    } catch (error) {
      console.log("get order error", error);
    }
  });

  // setup routes for posting new order
  app.post("/orders", async (req, res) => {
    try {
      // destructure the request body
      const { id, title, date, type, customer } = req.body;

      // create new order, validate the input in request body, if any error, return error message
      if (!id || !title || !date || !type || !customer) {
        res.status(400).json({
          message: "missing required fields",
        });
        return;
      }

      // check if the order already exists
      const isExistingOrder = orderList.find(
        (order: orderListType) => order.id === id
      );
      if (isExistingOrder) {
        res.status(400).json({
          message: "order already exists",
        });
        return;
      }

      // add new order and update the order list
      const newOrder = {
        id,
        title,
        date,
        type,
        customer,
      };
      orderList.push(newOrder);
      res.status(200).json(newOrder);
    } catch (error) {
      console.log("post order error", error);
    }
  });

  // setup routes for type and date query
  app.get("/orders/:type/:date", async (req, res) => {
    try {
      const { type, date } = req.params;

      // check if the type and date are valid
      if (!type || !date) {
        res.status(400).json({
          message: "missing required fields",
        });
        return;
      }

      // find orders by type and date
      const resultList = orderList.filter((order: orderListType) => {
        const splitDate = order.date.split("-");
        const refactorDate = `${splitDate[0]}${splitDate[1]}${splitDate[2]}`;
        return order.type === type && refactorDate === date;
      });

      // if there is result, return the result, otherwise return error message
      if (resultList.length > 0) {
        const result: orderQueryType = {
          type: resultList[0].type,
          count: resultList.length,
          orders: resultList.map((order: orderListType) => order.id),
          related_customers: resultList.map(
            (order: orderListType) => order.customer
          ),
        };
        res.status(200).json(result);
      } else {
        res.status(400).json({
          message: "no order found",
        });
      }
    } catch (error) {
      console.log("get order query error", error);
    }
  });

  // error handler
  app.use(async(err: any, req: any, res: any, next: any) => {
    await res.status(500).json({
      message: err.message,
    });
  });

  return app;
};

// start the Express server
createApp().then((app) => {
  app.listen(port, () => {
    console.log(`API started at http://localhost:${port}`);
  });
});
