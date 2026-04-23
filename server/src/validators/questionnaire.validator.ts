import { body } from "express-validator";
import { handleValidation } from "../middlewares/validate.middleware";

export const submitResponseValidator = [
  body("answers").custom((v) => {
    if (!v || typeof v !== "object")
      throw new Error("answers must be an object");
    return true;
  }),
  handleValidation,
];
