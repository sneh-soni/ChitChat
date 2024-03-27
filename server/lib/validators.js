import { body, validationResult, check, param } from "express-validator";
import { ErrorHandler } from "../utils/utility.js";

const validateHandler = (req, res, next) => {
  const errors = validationResult(req);

  const errorMessage = errors
    .array()
    .map((err) => err.msg)
    .join(",");

  if (errors.isEmpty()) return next();
  else next(new ErrorHandler(errorMessage, 400));
};

const registerValidator = () => [
  body("name", "Name Cannot be Empty").notEmpty(),
  body("username", "Username Cannot be Empty").notEmpty(),
  body("bio", "Bio Cannot be Empty").notEmpty(),
  body("password", "Password Cannot be Empty").notEmpty(),
  check("avatar").notEmpty().withMessage("Please Upload Avatar"),
];

const loginValidator = () => [
  body("username", "Username Cannot be Empty").notEmpty(),
  body("password", "Password Cannot be Empty").notEmpty(),
];

const newGroupValidator = () => [
  body("name", "Name Cannot be Empty").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please provide Members")
    .isArray({ min: 2, max: 50 })
    .withMessage("Members must be between 2-50"),
];

const addMemberValidator = () => [
  body("chatId", "Chat ID Cannot be Empty").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please provide Members")
    .isArray({ min: 1, max: 47 })
    .withMessage("Members must be between 1-47"),
];

const removeMemberValidator = () => [
  body("chatId", "Please provide Chat ID").notEmpty(),
  body("userId", "Please provide User ID").notEmpty(),
];

const chatIdValidator = () => [
  param("Id", "Please provide Chat ID").notEmpty(),
];

const renameGroupValidator = () => [
  param("Id", "Please provide Chat ID").notEmpty(),
  body("name", "Name Cannot be Empty").notEmpty(),
];

const sendAttachmentsValidator = () => [
  body("chatId", "Please provide Chat ID").notEmpty(),
  check("attachments")
    .notEmpty()
    .withMessage("Please provide Attachments")
    .isArray({ min: 1, max: 5 })
    .withMessage("Attachments must be between 1-5"),
];

export {
  registerValidator,
  validateHandler,
  loginValidator,
  newGroupValidator,
  addMemberValidator,
  removeMemberValidator,
  chatIdValidator,
  renameGroupValidator,
  sendAttachmentsValidator,
};
