import Knex from "knex";

/**
 * Seeds servem para popular a base
 * com dados padrões assim que a aplicação iniciar
 */

export async function seed(knex: Knex) {
  await knex("items").insert([
    { title: "Lâmpadas", image: "lampadas.svg" },
    { title: "Pilhas e Baterias", image: "baterias.svg" },
    { title: "Papéias e Papelão", image: "papeis-papelao.svg" },
    { title: "Resíduos Eletrônicos", image: "eletronicos.svg" },
    { title: "Óleo de Cozinha", image: "oleo.svg" },
    { title: "Resíduos Orgânicos", image: "organicos.svg" },
  ]);
}
