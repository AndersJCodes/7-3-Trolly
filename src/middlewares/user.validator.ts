import { body, ValidationChain } from "express-validator";

// Helper function to make validation rules optional
const makeOptional = (validationChain: ValidationChain): ValidationChain => {
  return validationChain.optional();
};

const createUserValidator = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters")
    .escape(),

  body("email")
    .isEmail()
    .withMessage("Email must be a valid email address")
    .bail()
    .normalizeEmail()
    .escape(),

  body("password")
    .isString()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password must be at least 6 characters and contain at least one lowercase letter, one uppercase letter, one number, and one special character"
    )
    .trim()
    .escape(),
];

const updateUserValidator = createUserValidator.map(makeOptional);

export { createUserValidator, updateUserValidator };
