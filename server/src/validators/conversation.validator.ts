import { body, param } from "express-validator";
import { handleValidation } from "../middlewares/validate.middleware";

export const idParamValidator = [
  param("id").isInt({ min: 1 }).withMessage("Invalid conversation id"),
  handleValidation,
];

export const sendMessageValidator = [
  param("id").isInt({ min: 1 }).withMessage("Invalid conversation id"),
  body("content")
    .isString()
    .withMessage("content must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("content must not be empty"),
  handleValidation,
];
