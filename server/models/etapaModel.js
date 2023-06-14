const db = require('../database/db');

class Etapas {
  static getAllEtapas(id_orden) {
    return new Promise((resolve, reject) => {
      const query = `select hoee.*, es.nombre_estados, et.nombre_etapas from historial_ordenes_etapas_estados hoee join etapas et on hoee.id_etapa = et.id join estados es on hoee.id_estado = es.id where hoee.id_orden = (?);`;

      db.query(query, [id_orden], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT hoee.*, e.nombre_estados, et.nombre_etapas FROM historial_ordenes_etapas_estados hoee JOIN estados e ON hoee.id_estado = e.id JOIN etapas et ON hoee.id_etapa = et.id WHERE hoee.id = ?;';

      db.query(query, [id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  };

  static createEtapa(etapaData) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO historial_ordenes_etapas_estados(id_orden, nro_ficha, id_etapa, id_estado, fecha_envio, fecha_entrega, fecha_inicio_estado, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      const values = [
        etapaData.id_orden,
        etapaData.nro_ficha,
        etapaData.id_etapa,
        etapaData.id_estado,
        etapaData.fecha_envio,
        etapaData.fecha_entrega,
        new Date(),
        etapaData.descripcion
      ];

      db.query(query, values, (error, results) => {
        if (error) {
          reject({ message: "Error en sql de la consulta getUser", Error: error });
        } else {
          resolve(results.insertId);
        }
      });
    });
  }

  static updateEtapa(etapaData) {
    return new Promise((resolve, reject) => {
      const { id, descripcion, fecha_entrega, fecha_envio, fecha_inicio_estado, id_estado, id_etapa, id_orden, nro_ficha } = etapaData;

      const query = 'UPDATE historial_ordenes_etapas_estados SET descripcion = ?, fecha_entrega = ?, fecha_envio = ?, fecha_inicio_estado = ?, id_estado = ?, id_etapa = ?, id_orden = ?, nro_ficha = ? WHERE id = ?';
      const values = [descripcion, fecha_entrega, fecha_envio, fecha_inicio_estado, id_estado, id_etapa, id_orden, nro_ficha, id];

      db.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  };

  static deleteEtapa(id) {
    return new Promise((resolve, reject) => {
      const deleteSql = 'DELETE FROM historial_ordenes_etapas_estados WHERE id = ?';

      db.query(deleteSql, [id], (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }
}

module.exports = Etapas;
