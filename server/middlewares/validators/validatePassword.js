const { check, validationResult } = require("express-validator");

const validarPassword = () => {
  return [
    check('password', 'Password es inválido')
      .trim()
      .escape()
      .isLength({ min: 8 }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: "La contraseña debe tener al menos 8 caracteres." });
      }
      next();
    }
  ];
};

module.exports = validarPassword;
