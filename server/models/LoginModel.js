const db = require('../database/db');

class LoginModel {
  static findByEmail(email, callback) {
    const sql = 'SELECT p.id,p.rut, u.password, p.email, p.rol_id FROM usuarios u JOIN personas p ON u.rut = p.rut WHERE p.email = ?';
    db.query(sql, [email], (error, results) => {
      if (error) {
        console.error('Error al ejecutar la consulta:', error);
        callback(error, null);
        return;
      }

      if (results.length === 0) {
        callback(null, null); // El usuario no existe
        return;
      }

      const user = results[0];
      callback(null, user);
    });
  }

  
}

module.exports = LoginModel;
