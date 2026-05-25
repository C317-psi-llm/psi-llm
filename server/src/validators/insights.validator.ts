import { body, param, query } from "express-validator";
import { handleValidation } from "../middlewares/validate.middleware";

const SERIEDADE = ["padrao", "alerta", "bom"];

export const idParamValidator = [
  param("id").isInt({ min: 1 }).withMessage("Invalid insight id"),
  handleValidation,
];

export const listInsightsQueryValidator = [
  query("id_usuario")
    .isInt({ min: 1 })
    .withMessage("id_usuario must be a positive integer"),
  handleValidation,
];

export const createInsightValidator = [
  body("id_usuario").isInt({ min: 1 }),
  body("conteudo").isString().bail().trim().notEmpty(),
  body("seriedade").isIn(SERIEDADE),
  handleValidation,
];

export const updateInsightValidator = [
  param("id").isInt({ min: 1 }),
  body("conteudo").optional().isString().bail().trim().notEmpty(),
  body("seriedade").optional().isIn(SERIEDADE),
  body().custom((v) => {
    if (v.conteudo === undefined && v.seriedade === undefined) {
      throw new Error("Provide conteudo or seriedade");
    }
    return true;
  }),
  handleValidation,
];
