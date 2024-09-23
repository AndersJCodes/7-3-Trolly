import { body, ValidationChain } from "express-validator";

const makeOptional = (validationChain: ValidationChain): ValidationChain => {
  return validationChain.optional();
};

// Validator for creating a task
const createTaskValidator = [
  body("title")
    .isString()
    .withMessage("Title must be a string")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters")
    .escape(),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .escape(),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid date")
    .escape(),
];

const updateTaskValidator = createTaskValidator.map(makeOptional);

// Export validators
export { createTaskValidator, updateTaskValidator };
