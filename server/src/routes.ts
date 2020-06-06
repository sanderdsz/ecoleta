import express, { response, request } from "express";
import multer from "multer";
import multerConfig from "./config/multer";

import PointsController from "./controllers/PointsController";
import ItemsController from "./controllers/ItemsController";

const upload = multer(multerConfig);

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

routes.post("/points", upload.single("image"), pointsController.create);

export default routes;
