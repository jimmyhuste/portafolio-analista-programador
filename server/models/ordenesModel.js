const db = require('../database/db');

class OrdenesModel {


    static get(callback) {
        const sql = `
      SELECT o.id, o.numero_ficha, o.fecha_creacion, tt.nombre_trabajo, c.nombre_centro
      FROM ordenes_de_trabajo o
      JOIN tipo_trabajo tt ON o.tipo_trabajo = tt.id
      JOIN centros_hospitalarios c ON o.centro = c.id
    `;

        db.query(sql, (error, results) => {
            if (error) {
                console.error('Error al consultar la base de datos:', error);
                callback('Error al consultar la base de datos', null);
                return;
            }

            callback(null, results);
        });
    }

    static getById(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT o.*, p.nombre AS doctor_name, p.apellido AS doctor_last_name, p2.nombre AS patient_name, p2.apellido AS patient_last_name, p2.fecha_nacimiento AS patient_birth_date FROM ordenes_de_trabajo o JOIN personas p ON o.rut_doctor = p.rut JOIN personas p2 ON o.rut_paciente = p2.rut WHERE o.id = ?`;
            db.query(sql, [id], (error, result) => {
                if (error) {
                    console.error('Error executing query:', error);
                    reject(error);
                    return;
                }

                if (result.length === 0) {
                    resolve(null); // No se encontró la orden con el ID dado
                    return;
                }

                resolve(result[0]);
            });
        });
    }
    
    static create(ordenData, callback) {
        const {
            nombre,
            apellido,
            fecha_nacimiento,
            fecha_creacion,
            numero_ficha,
            rut_paciente,
            centro,
            rut_doctor,
            tipo_trabajo,
            protesis,
            completitud,
            color,
            ubicacion,
            indicaciones,
            tipo_factura,
            fecha_facturacion,
            licencia,
            etapa
        } = ordenData;
    
        console.log(nombre, rut_doctor, rut_paciente);
    
        const existFichaSql = 'SELECT * FROM ordenes_de_trabajo WHERE numero_ficha = ?';
        db.query(existFichaSql, [numero_ficha], (error, fichaResults) => {
            if (error) {
                console.error('Error al ejecutar la consulta existFichaSql:', error);
                callback({ message: 'Error al ejecutar la consulta.' }, null);
                return;
            }
    
            if (fichaResults.length > 0) {
                callback({ message: 'La solicitud ya existe.' }, null);
                return;
            }
    
            const sqlPersonas = 'INSERT INTO personas (rut, nombre, apellido, fecha_nacimiento, rol_id) VALUES (?)';
            const sqlOrdenes = `INSERT INTO ordenes_de_trabajo (
                fecha_creacion,
                numero_ficha,
                rut_paciente,
                centro,
                rut_doctor,
                tipo_trabajo,
                protesis,
                completitud,
                color,
                ubicacion,
                indicaciones,
                tipo_factura,
                fecha_facturacion,
                licencia
            ) VALUES (?)`;
    
            const valuesP = [
                [rut_doctor, nombre, apellido, fecha_nacimiento, 3],
                [rut_paciente, nombre, apellido, fecha_nacimiento, 5]
            ];
            const valuesO = [[
                fecha_creacion,
                numero_ficha,
                rut_paciente,
                centro,
                rut_doctor,
                tipo_trabajo,
                protesis,
                completitud,
                color,
                ubicacion,
                indicaciones,
                tipo_factura,
                fecha_facturacion,
                licencia
            ]];
    
            let ordenId; // Variable para almacenar el ID de la orden de trabajo
    
            new Promise((resolve, reject) => {
                db.query(sqlPersonas, valuesP, (error, result) => {
                    if (error) {
                        console.error('Error al ejecutar la consulta de inserción en la tabla personas:', error);
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
            })
            .then((result) => {
                return new Promise((resolve, reject) => {
                    db.query(sqlOrdenes, valuesO, (error, result) => {
                        if (error) {
                            console.error('Error al ejecutar la consulta de inserción en la tabla ordenes_de_trabajo:', error);
                            reject(error);
                        } else {
                            ordenId = result.insertId; // Guardar el ID de la orden de trabajo
                            resolve(result);
                        }
                    });
                });
            })
            .then((result) => {
                const sqlHistorial = `INSERT INTO historial_ordenes_etapas_estados (id_orden, nro_ficha, id_etapa, fecha_inicio_estado, descripcion) VALUES (?)`;
                const valuesHistorial = [[
                    ordenId,
                    numero_ficha,
                    etapa, 
                    new Date(), 
                    indicaciones 
                ]];
    
                db.query(sqlHistorial, valuesHistorial, (error, result) => {
                    if (error) {
                        console.error('Error al ejecutar la consulta de inserción en la tabla historial_ordenes_etapas_estados:', error);
                        callback({ message: 'Error al crear la orden de trabajo.' }, null);
                    } else {
                        callback(null, {
                            message: 'Orden de trabajo creada exitosamente',
                            ordenId: ordenId
                        });
                    }
                });
            })
            .catch((error) => {
                console.error('Error:', error);
                callback({ message: 'Error al crear la orden de trabajo.' }, null);
            });
        });
    }
    
    static deleteOrden(id) {
        return new Promise((resolve, reject) => {
          const selectSql = 'SELECT rut_doctor, rut_paciente FROM ordenes_de_trabajo WHERE id = ?';
          db.query(selectSql, [id], (error, result) => {
            if (error) {
              console.error('Error executing query:', error);
              reject(error);
              return;
            }
      
            if (result.length === 0) {
              const errorMessage = 'No se encontró la orden con el ID dado';
              reject(new Error(errorMessage));
              return;
            }
      
            // Eliminar los registros relacionados en la tabla historial_ordenes_etapas_estados
            const deleteHistorialSql = 'DELETE FROM historial_ordenes_etapas_estados WHERE id_orden = ?';
            db.query(deleteHistorialSql, [id], (error, result) => {
              if (error) {
                console.error('Error executing query:', error);
                reject(error);
                return;
              }
      
              // Eliminar la orden de trabajo
              const deleteOrdenSql = 'DELETE FROM ordenes_de_trabajo WHERE id = ?';
              db.query(deleteOrdenSql, [id], (error, result) => {
                if (error) {
                  console.error('Error executing query:', error);
                  reject(error);
                  return;
                }
      
                resolve(result.affectedRows);
              });
            });
          });
        });
      }
      
    

    
    static update(orderId, orderData, callback) {
        const {
            etapa,
            fecha_creacion,
            numero_ficha,
            rut_paciente,
            centro,
            rut_doctor,
            tipo_trabajo,
            protesis,
            completitud,
            color,
            ubicacion,
            indicaciones,
            tipo_factura,
            fecha_facturacion,
            licencia
        } = orderData;
    
        const sqlOrdenes = `UPDATE ordenes_de_trabajo SET
            fecha_creacion = ?,
            numero_ficha = ?,
            rut_paciente = ?,
            centro = ?,
            rut_doctor = ?,
            tipo_trabajo = ?,
            protesis = ?,
            completitud = ?,
            color = ?,
            ubicacion = ?,
            indicaciones = ?,
            tipo_factura = ?,
            fecha_facturacion = ?,
            licencia = ?
            WHERE id = ?`;
    
        const valuesO = [
            fecha_creacion,
            numero_ficha,
            rut_paciente,
            centro,
            rut_doctor,
            tipo_trabajo,
            protesis,
            completitud,
            color,
            ubicacion,
            indicaciones,
            tipo_factura,
            fecha_facturacion,
            licencia,
            orderId
        ];
    
        const existOrderSql = 'SELECT * FROM ordenes_de_trabajo WHERE id = ?';
        db.query(existOrderSql, [orderId], (error, orderResult) => {
            if (error) {
                console.error('Error al ejecutar la consulta existOrderSql:', error);
                callback(error, null);
            } else if (orderResult.length === 0) {
                callback(new Error('La orden de trabajo no existe.'), null);
            } else {
                db.query(sqlOrdenes, valuesO, (error, result) => {
                    if (error) {
                        console.error('Error al ejecutar la consulta de actualización:', error);
                        callback(error, null);
                    } else {
                        const sqlHistorial = `INSERT INTO historial_ordenes_etapas_estados (id_orden, nro_ficha, id_etapa, fecha_inicio_estado, descripcion) VALUES (?)`;
                        const valuesHistorial = [[
                            orderId,
                            numero_ficha,
                            etapa,
                            fecha_creacion,
                            indicaciones 
                        ]];
    
                        db.query(sqlHistorial, valuesHistorial, (error, result) => {
                            if (error) {
                                console.error('Error al ejecutar la consulta de inserción en la tabla historial_ordenes_etapas_estados:', error);
                                callback(error, null);
                            } else {
                                callback(null, orderId);
                            }
                        });
                    }
                });
            }
        });
    }
    

}




module.exports = OrdenesModel;
