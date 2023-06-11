const db = require('../database/db');

class UserModel {

  static update(userId, userData, callback) {
    const { rut, password, imagen } = userData;
    const sql = 'UPDATE usuarios SET rut = ?, password = ?, imagen = ? WHERE id = ?';
    const values = [rut, password, imagen, userId];

    db.query(sql, values, (error, result) => {
      if (error) {
        console.error('Error al ejecutar la consulta:', error);
        callback(null, error);
        return;
      }

      callback();
    });
  }

  static delete(userId, callback) {
    const sql = 'DELETE FROM usuarios WHERE id = ?';
    const values = [userId];

    db.query(sql, values, (error, result) => {
      if (error) {
        console.error('Error al ejecutar la consulta:', error);
        callback(null, error);
        return;
      }

      callback();
    });
  }

  // Resto de los métodos del modelo...
}

module.exports = UserModel;
