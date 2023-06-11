const { check, validationResult } = require("express-validator");

const validarOrdenes = () => {
    return [
        check('nombre', 'Nombre es inválido')
            .trim()
            .notEmpty()
            .isLength({ min: 3, max: 25 })
            .withMessage('El nombre debe tener entre 3 y 25 caracteres')
            .custom((value) => !/\d/.test(value))
            .withMessage('El nombre no puede contener caracteres numéricos')
            .escape(),

        check('apellido', 'Apellido es inválido')
            .trim()
            .notEmpty()
            .isLength({ min: 3, max: 25 })
            .withMessage('El apellido debe tener entre 3 y 25 caracteres')
            .custom((value) => !/\d/.test(value))
            .withMessage('El apellido no puede contener caracteres numéricos')
            .escape(),
        check('rut_doctor', 'Rut es inválido, debe tener el siguiente formato: [ 11111111-1')
            .notEmpty()
            .withMessage('El Rut debe tener el siguiente formato: [ 11111111-1 ]')
            .isLength({min: 9, max:10})
            .escape(),
        check('fecha_nacimiento', 'Fecha de nacimiento es inválida')
            .optional({ checkFalsy: true })
            .isDate()
            .withMessage('La fecha de nacimiento debe tener el siguiente formato: YYYY-MM-DD'),

        check('fecha_creacion', 'Fecha de creación es inválida')
            .notEmpty()
            .isDate()
            .withMessage('La fecha de creación debe tener el siguiente formato: YYYY-MM-DD'),

        check('etapa', 'Etapa es inválida')
            .optional({ checkFalsy: true })
            .isInt()
            .withMessage('La etapa debe ser un número entero'),

        check('numero_ficha', 'Número de ficha es inválido')
            .notEmpty()
            .isInt()
            .withMessage('El número de ficha debe ser un número entero'),

        check('centro', 'Centro es inválido')
            .notEmpty()
            .isInt()
            .withMessage('El centro debe ser un número entero'),

        check('tipo_trabajo', 'Tipo de trabajo es inválido')
            .notEmpty()
            .isInt()
            .withMessage('El tipo de trabajo debe ser un número entero'),

        check('protesis', 'Prótesis es inválida')
            .notEmpty()
            .isInt()
            .withMessage('La prótesis debe ser un número entero'),

        check('completitud', 'Completitud es inválida')
            .notEmpty()
            .isInt()
            .withMessage('La completitud debe ser un número entero'),

        check('color', 'Color es inválido')
            .notEmpty()
            .isInt()
            .withMessage('El color debe ser un número entero'),

        check('ubicacion', 'Ubicación es inválida')
            .notEmpty()
            .isInt()
            .withMessage('La ubicación debe ser un número entero'),

        check('indicaciones', 'Indicaciones son inválidas')
            .optional({ checkFalsy: true })
            .isLength({ max: 300 })
            .withMessage('Las indicaciones deben tener menos de 300 caracteres')
            .escape(),

        check('tipo_factura', 'Tipo de factura es inválido')
            .notEmpty()
            .isInt()
            .withMessage('El tipo de factura debe ser un número entero'),

        check('fecha_facturacion', 'Fecha de facturación es inválida')
            .optional({ checkFalsy: true })
            .isDate()
            .withMessage('La fecha de facturación debe tener el siguiente formato: YYYY-MM-DD'),

        check('licencia', 'Licencia es inválida')
            .optional({ checkFalsy: true })
            .notEmpty()
            .isInt()
            .withMessage('La licencia debe ser un número entero'),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const formattedErrors = errors.array().map((error) => {
                    return error.msg;
                });
                return res.status(400).json({ errors: formattedErrors });
            }
            next();
        }
    ];
};

module.exports = validarOrdenes;
