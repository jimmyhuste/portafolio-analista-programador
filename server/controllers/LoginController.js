const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret_key = process.env.SECRET_KEY;

const LoginModel = require('../models/LoginModel');

class LoginController {
  static login(req, res, next) {
    const { email, password } = req.body;

    LoginModel.findByEmail(email, (error, user) => {
      if (error) {
        return next(error);
      }

      if (!user) {
        res.status(404).json({ message: 'Usuario o Contraseña incorrecto.' });
        return;
      }

      bcrypt.compare(password, user.password, (error, result) => {
        if (error) {
          console.error('Error al comparar contraseñas:', error);
          return next(error);
        }

        if (!result) {
          res.status(401).json({ message: 'Usuario o Contraseña incorrecto.' });
          return;
        }

        function generarToken(email, rol_id) {
          const payload = {
            email: email,
            rol_id: rol_id,
          };
          const token = jwt.sign(payload, secret_key, { expiresIn: '1d' });
          return token;
        }

        const tokenUsuario = generarToken(email, user.rol_id);
        console.log(tokenUsuario);
        res.cookie('token', tokenUsuario, {
          maxAge: 86400000, httpOnly: true,
          sameSite: "None", // Set SameSite attribute to None
          secure: true,
        });

        res.json({ Status: "Success", token: tokenUsuario });
      });
    });
  }

  static logout(req, res, next) {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: "None",
      secure: true
    });
    res.json({ Status: "Success", message: "Logout exitoso" });
  }

}

module.exports = LoginController;
