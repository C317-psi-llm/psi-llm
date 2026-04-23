import { body } from "express-validator";
import { handleValidation } from "../middlewares/validate.middleware";

export const loginValidator = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isString()
    .isLength({ min: 6 })
    .withMessage("Password required (min 6 chars)"),
  handleValidation,
];
