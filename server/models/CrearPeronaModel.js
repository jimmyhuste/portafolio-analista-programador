const db = require('../database/db');

const bcrypt = require("bcrypt")

class Persona {
  constructor(rut, imagen, name, lastName, birthDate, adress, phone, email, nombre_rol, rol_id) {
    this.rut = rut;
    this.name = name;
    this.lastName = lastName;
    this.birthDate = birthDate;
    this.adress = adress;
    this.phone = phone;
    this.email = email;
    this.nombre_rol = nombre_rol;
    this.imagen = imagen;
    this.rol_id = rol_id;
  }

  static getAll(callback) {
    const sql = 'SELECT r.nombre_rol, p.nombre, p.apellido, u.imagen, p.email, p.id, p.rut FROM personas p JOIN roles r ON p.rol_id = r.id JOIN usuarios u on u.rut = p.rut;';
    db.query(sql, (error, results) => {
      if (error) throw error;
      callback(results);
    });
  }

  static getById(id, callback) {
    const sql = "SELECT * FROM personas p JOIN usuarios u ON p.rut = u.rut WHERE p.id = ?;";
    db.query(sql, [id], (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        const persona = new Persona(
          results[0].rut,
          results[0].imagen,
          results[0].nombre,
          results[0].apellido,
          results[0].fecha_nacimiento,
          results[0].direccion,
          results[0].celular,
          results[0].email,
          results[0].rol_id
        );
        callback(persona);
      } else {
        callback(null);
      }
    });
  }

  static create(personaData, callback) {
    const { name, lastName, rut, email, birthDate, address, password, confirmPassword, role, image, phone } = personaData;
    console.log("Personadata", personaData)
    const existSql = 'SELECT * FROM personas WHERE rut = ? OR email = ?';
    db.query(existSql, [rut, email], (error, results) => {
      if (error) {
        callback(error);
        return;
      }
      if (results.length > 0) {
        const existingData = results[0];
        if (existingData.rut === rut) {
          callback('El rut ya existe en la base de datos.');
        } else if (existingData.email === email) {
          callback('El correo electrónico ya existe en la base de datos.');
        }
        return;
      }
      const sqlUsuarios = 'INSERT INTO usuarios (rut, password, imagen) VALUES (?, ?, ?)';
      const sqlPersonas = 'INSERT INTO personas (rut, nombre, apellido, fecha_nacimiento, direccion, celular, email, rol_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

      const valuesP = [rut, name, lastName, birthDate, address, phone, email, role];

      bcrypt.hash(password, 10, (error, hashedPass) => {
        if (error) {
          console.error('Error al aplicar el hash al password:', error);
          return;
        }

        const valuesU = [rut, hashedPass, image];

        console.log('Password hasheado:', hashedPass);

        new Promise((resolve, reject) => {
          db.query(sqlPersonas, valuesP, (error, result) => {
            if (error) {
              console.error('Error al ejecutar la query de inserción de personas:', error);
              reject(error);
            } else {
              resolve(result);
            }
          });
        })
          .then((result) => {
            return new Promise((resolve, reject) => {
              db.query(sqlUsuarios, valuesU, (error, result) => {
                if (error) {
                  console.error('Error al ejecutar la query de inserción de usuarios:', error);
                  reject(error);
                } else {
                  resolve(result);
                }
              });
            });
          })
          .then((result) => {
            callback(null, result.insertId);
          })
          .catch((error) => {
            console.error('Error:', error);
            callback(error);
          });
      });
    });
  }



  static update(personaData) {
    return new Promise((resolve, reject) => {
      const { name,
        lastName,
        rut,
        email,
        birthDate,
        address,
        role,
        image,
        phone } = personaData;
      console.log(personaData)
      const sqlPersonas = 'UPDATE personas SET nombre=?, apellido=?, fecha_nacimiento=?, direccion=?, celular=?, email=?, rol_id=? WHERE rut=?';
      const sqlUsuarios = 'UPDATE usuarios SET imagen=? WHERE rut=?';
      const valuesP = [name, lastName, birthDate, address, phone, email, role, rut];
      const valuesU = [image, email, rut];

      db.beginTransaction((error) => {
        if (error) {
          console.error('Error al iniciar la transacción:', error);
          reject(error);
          return;
        }

        db.query(sqlPersonas, valuesP, (error, result) => {
          if (error) {
            console.error('Error al ejecutar la consulta de personas:', error);
            db.rollback(() => {
              reject(error);
            });
          } else {
            db.query(sqlUsuarios, valuesU, (error, result) => {
              if (error) {
                console.error('Error al ejecutar la consulta de usuarios:', error);
                db.rollback(() => {
                  reject(error);
                });
              } else {
                db.commit((error) => {
                  if (error) {
                    console.error('Error al confirmar la transacción:', error);
                    db.rollback(() => {
                      reject(error);
                    });
                  } else {
                    resolve(result);
                  }
                });
              }
            });
          }
        });
      });
    });
  }

  static delete(rut, callback) {
    const existSql = 'SELECT * FROM usuarios WHERE rut = ?';
    db.query(existSql, [rut], (error, results) => {
      if (error) throw error;
      console.log(results); // Imprime los resultados de la consulta
      if (results.length === 0) {
        callback('Usuario no encontrado');
        return;
      }

      const sqlUsuarios = 'DELETE FROM usuarios WHERE rut = ?';
      const sqlPersonas = 'DELETE FROM personas WHERE rut = ?';

      // Verificar si el usuario existe antes de eliminarlo

      // El usuario existe, proceder a eliminarlo
      db.query(sqlUsuarios, [rut], (error) => {
        if (error) throw error;
        db.query(sqlPersonas, [rut], (error) => {
          if (error) throw error;
          callback(null, 'Usuario eliminado correctamente');
        });
      });
    });
  }








}


module.exports = Persona;
