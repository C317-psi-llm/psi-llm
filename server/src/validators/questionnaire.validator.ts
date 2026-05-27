import { body, query } from "express-validator";
import { handleValidation } from "../middlewares/validate.middleware";

export const historyQueryValidator = [
  query("days")
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage("days must be an integer between 1 and 365"),
  handleValidation,
];

export const submitResponseValidator = [
  body("responses").custom((v) => {
    if (!v || typeof v !== "object")
      throw new Error("answers must be an object");
    return true;
  }),
  handleValidation,
];
