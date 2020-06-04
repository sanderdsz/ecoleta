import express, { response, request } from "express";

import PointsController from "./controllers/PointsController";
import ItemsController from "./controllers/ItemsController";

// Index, Show, Create, Update,
const routes = express.Router();
const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.get("/", (request, response) => {
  return response.json({ message: "Hello world!" });
});

routes.post("/points", pointsController.create);
routes.get("/points/:id", pointsController.show);
routes.get("/points/", pointsController.index);

routes.get("/items", itemsController.index);

export default routes;
