const validarRut = require('../helpers/validarRut');
const jwt = require("jsonwebtoken");

require('dotenv').config();

const bcrypt = require("bcrypt")

const uploadMiddleware = require("../middlewares/upload.middleware")
const Persona = require('../models/CrearPeronaModel');

class CrearPersonaController {
  static getAll(req, res) {
    Persona.getAll((results) => {

      res.json({ Status: "Success", data: results });
    });
  }

  static getById(req, res) {
    const id = req.params.id;
    Persona.getById(id, (result) => {
      if (result) {
        res.json({ data: result });
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    });
  }

  static create(req, res) {
    uploadMiddleware.single('imagen')(req, res, (err) => {
      if (err) {
        console.error('Error al cargar la imagen:', err);
        // Manejo del error al cargar la imagen
        return;
      }

      // Aquí puedes acceder a la imagen cargada a través de req.file
      const imagen = req.file ? req.file.filename : null;
      const { name, lastName, rut, email, birthDate, address, password, confirmPassword, role, image, phone } = req.body;
      console.log(req.body)
      const allowedFormats = /\.(png|jpe?g)$/i;



      if (password !== confirmPassword) {
        res.status(400).json({
          estado: 'Failed',
          message: 'Las contraseñas no coinciden',
        });
        return;
      }

      if (validarRut(rut)) {
        Persona.create(
          { name, lastName, rut, email, birthDate, address, password, confirmPassword, role, image, phone },
          (error, personaId) => {
            if (error) {
              res.status(400).json({
                estado: 'Error',
                message: error,
              });
            } else {
              res.json({
                message: 'Persona creada exitosamente',
                Status: "Success",
              });
            }
          }
        );
      } else {
        res.status(400).json({
          estado: 'Rut inválido',
          message: 'El Rut debe tener el siguiente formato: [ 11111111-1 ]',
        });
      }
    });
  }






  static update(req, res) {
    const { id } = req.params;
    console.log(req.body)
    const { name,
      lastName,
      rut,
      email,
      birthDate,
      address,
      role,
      image,
      phone, } = req.body;

    const personaData = {
      name,
      lastName,
      rut,
      email,
      birthDate,
      address,
      role,
      image,
      phone,
    };

    // if (password !== password_confirm) {
    //   return res.status(400).json({
    //     estado: 'Failed',
    //     message: 'Las contraseñas no coinciden',
    //   });
    // }

    if (!id) {
      return res.status(400).json({
        estado: 'Failed',
        message: 'Debes proporcionar un ID',
      });
    }

    if (validarRut(rut)) {
      Persona.update(personaData)
        .then(result => {
          res.json({
            Status: "Success",
            message: 'Persona actualizada exitosamente',
          });
        })
        .catch(error => {
          console.error('Error al actualizar la persona:', error);
          res.status(500).json({
            error: 'Error al actualizar la persona'
          });
        });
    } else {
      res.status(400).json({
        estado: 'Rut inválido',
        message: 'El Rut debe tener el siguiente formato: [ 11111111-1 ]',
      });
    }
  }



  static delete(req, res) {
    const id = req.params.id;

    Persona.delete(id, (error, message) => {
      if (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(404).json({ error: 'Usuario no encontrado' });
      } else {
        res.json({
          message: message,
          Status: 'Success',
        });
      }
    });
  }
}



module.exports = CrearPersonaController;
