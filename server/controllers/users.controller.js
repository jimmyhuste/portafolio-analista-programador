const UserModel = require('../models/users.model');
const jwt = require('jsonwebtoken');
const validarRut = require('../helpers/validarRut');

class UserController {
  static create(req, res, next) {
    const { rut, password } = req.body;
    const imagen = req.file ? req.file.filename : null;

    function generarToken(rut) {
      const payload = {
        rut: rut,
        expiresIn: Date.now() + (60 * 60 * 1000) // Expira en 1 hora (en milisegundos)
      };
      const token = jwt.sign(payload, 'claveSecreta', { expiresIn: '1h' });
      return token;
    }

    const tokenUsuario = generarToken(rut);
    console.log(tokenUsuario);
    res.cookie('token', tokenUsuario, { maxAge: 3600000, httpOnly: true });
    if (validarRut(rut)) {
      UserModel.create({ rut, password, imagen }, (userId, error) => {
        if (error) {
          return next(error);
        }
        res.json({
          message: 'Usuario creado exitosamente',
          token: tokenUsuario
        });
      });
    } else {
      res.status(400).json({
        estado: "Rut invalido",
        message: "El Rut debe tener el siguiente formato: [ 11111111-1 ]"
      });
    }
  }

  static update(req, res, next) {
    const userId = req.params.id;
    const { rut, password } = req.body;
    const imagen = req.file ? req.file.filename : null;

    UserModel.update(userId, { rut, password, imagen }, (error) => {
      if (error) {
        return next(error);
      }

      res.json({
        message: 'Usuario actualizado exitosamente',
        userId: userId,
      });
    });
  }

  static delete(req, res, next) {
    const userId = req.params.id;

    UserModel.delete(userId, (error) => {
      if (error) {
        return next(error);
      }

      res.json({
        message: 'Usuario eliminado exitosamente',
        userId: userId,
      });
    });
  }

  // Resto de los métodos del controlador...
}

module.exports = UserController;
