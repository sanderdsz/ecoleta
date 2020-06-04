import knex from "../database/connection";
import { Request, Response } from "express";

class PointsController {
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;

    // Converter de string para array
    const parsedItems = String(items)
      .split(",")
      .map((item) => Number(item.trim()));

    const points = await knex("points")
      .join("point_items", "points.id", "=", "point_items.point_id")
      .whereIn("point_items.item_id", parsedItems)
      .where("city", String(city))
      .where("uf", String(uf))
      .distinct()
      .select("points.*");

    return response.json(points);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex("points").where("id", id).first();

    if (!point) {
      return response.status(400).json({ message: "Point not found." });
    }

    /**
     ** SELECT * FROM items
     **   JOIN point_items ON items.id = point_items.item_id
     **  WHERE point_items.point_id = {id}
     */

    const items = await knex("items")
      .join("point_items", "items.id", "=", "point_items.item_id")
      .where("point_items.point_id", id)
      .select("items.title");

    return response.json({ point, items });
  }

  /**
   * @post Ponto de coleta
   */
  async create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      items,
      uf,
    } = request.body;

    // Short syntax
    const point = {
      image: "image-fake",
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };

    // Algoritmo para não conflitar entre queries relacionais
    const transaction = await knex.transaction();

    const insertedIds = await transaction("points").insert(point);

    const point_id = insertedIds[0];

    // Relacionamento entre tabelas items -> point
    const pointItems = items.map((item_id: number) => {
      return {
        item_id,
        point_id,
      };
    });

    await transaction("point_items").insert(pointItems);

    // Commita o insert na base
    await transaction.commit();

    // Retorna o JSON salvo
    return response.json({
      id: point_id,
      ...point,
    });
  }
}

export default PointsController;
