import express from "express";

const app = express();

app.get("/users", (request, response) => {
  console.log("Hello world!");

  // JSON

  // Método de retorno prinicipal da api
  response.json("Hello world! Hey, Sander.");
});

app.listen(3333);
