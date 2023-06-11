const db = require('../database/db');

class OrdenesModel {


    static get(callback) {
        const sql = "SELECT id, numero_ficha, fecha_creacion, fecha_inicio_estado, fecha_entrega, fecha_envio, nombre_tipo, fecha_facturacion, nombre_ubicaciones, rut_doctor, nombre_trabajo, nombre_centro, nombre_etapas, id_etapa, nombre_protesis, nombre_completitud FROM(SELECT tf.nombre_tipo, co.nombre_completitud,p.nombre_protesis,u.nombre_ubicaciones,o.id, o.numero_ficha, o.centro, o.rut_paciente, o.rut_doctor, o.fecha_creacion, tt.nombre_trabajo, c.nombre_centro, e.nombre_etapas, hoee.id AS id_etapa, o.fecha_facturacion, hoee.fecha_entrega, hoee.fecha_envio, hoee.fecha_inicio_estado, ROW_NUMBER() OVER(PARTITION BY o.id ORDER BY hoee.fecha_inicio_estado DESC) AS row_num FROM ordenes_de_trabajo o JOIN tipo_trabajo tt ON o.tipo_trabajo = tt.id JOIN centros_hospitalarios c ON o.centro = c.id JOIN historial_ordenes_etapas_estados hoee ON o.id = hoee.id_orden JOIN etapas e ON e.id = hoee.id_etapa JOIN ubicaciones u ON o.ubicacion = u.id JOIN protesis p ON p.id = o.protesis JOIN completitud co ON co.id = o.completitud JOIN tipo_factura tf ON o.tipo_factura = tf.id) AS subquery WHERE row_num = 1 ORDER BY fecha_creacion DESC;";

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
            creationDate,
            fileNumber,
            patientName,
            patientLastName,
            patientRut,
            patientBirthDate,
            medicalCenter,
            doctorName,
            doctorLastName,
            doctorRut,
            workType,
            prothesis,
            completitude,
            stage,
            color,
            location,
            indications,
            billing,
            billingDate,
            licence,
        } = ordenData;


        const existFichaSql = 'SELECT * FROM ordenes_de_trabajo WHERE numero_ficha = ?';
        db.query(existFichaSql, [fileNumber], (error, fichaResults) => {
            if (error) {
                console.error('Error al ejecutar la consulta existFichaSql:', error);
                callback({ message: 'Error al ejecutar la consulta.' }, null);
                return;
            }

            if (fichaResults.length > 0) {
                callback({ message: 'La solicitud ya existe.' }, null);
                return;
            }

            const sqlPersonas = 'INSERT INTO personas (rut, nombre, apellido, fecha_nacimiento, rol_id) VALUES ?';
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
                [patientRut, patientName, patientLastName, patientBirthDate, 5],
                [doctorRut, doctorName, doctorLastName, null, 3]
            ];

            const valuesO = [[
                creationDate,
                fileNumber,
                patientRut,
                medicalCenter,
                doctorRut,
                workType,
                prothesis,
                completitude,
                color,
                location,
                indications,
                billing,
                billingDate,
                licence
            ]];

            let ordenId; // Variable para almacenar el ID de la orden de trabajo

            new Promise((resolve, reject) => {
                db.query(sqlPersonas, [valuesP], (error, result) => {
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
                    const sqlHistorial = `INSERT INTO historial_ordenes_etapas_estados (id_orden, nro_ficha, id_etapa, fecha_inicio_estado) VALUES (?)`;
                    const valuesHistorial = [[
                        ordenId,
                        fileNumber,
                        stage,
                        new Date()
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
            creationDate,
            fileNumber,
            patientName,
            patientLastName,
            patientRut,
            patientBirthDate,
            medicalCenter,
            doctorName,
            doctorLastName,
            doctorRut,
            workType,
            prothesis,
            completitude,
            stage,
            color,
            location,
            billing,
            billingDate,
            indications,
            licence,
        } = orderData;

        const existOrderSql = 'SELECT * FROM ordenes_de_trabajo WHERE id = ?';
        db.query(existOrderSql, [orderId], (error, orderResult) => {
            if (error) {
                console.error('Error al ejecutar la consulta existOrderSql:', error);
                callback(error, null);
            } else if (orderResult.length === 0) {
                callback(new Error('La orden de trabajo no existe.'), null);
            } else {
                const sqlPaciente = "UPDATE personas SET nombre = ?, apellido = ?, fecha_nacimiento = ? WHERE rut = ?;";
                const sqlDoctor = "UPDATE personas SET nombre = ?, apellido = ? WHERE rut = ?;";
                const sqlOrden = "UPDATE ordenes_de_trabajo SET fecha_creacion =?, numero_ficha = ?,centro = ?,tipo_trabajo = ? , protesis = ? , completitud = ? ,color = ?, ubicacion = ?,indicaciones = ?,tipo_factura = ?,fecha_facturacion = ?,licencia = ? WHERE id = ?;"
                const sqlHistorial = "UPDATE historial_ordenes_etapas_estados SET nro_ficha = ? where id_orden = ?";
                const patientValues = [
                    patientName,
                    patientLastName,
                    patientBirthDate,
                    patientRut,
                ]
                db.query(sqlPaciente, patientValues, (err, result) => {
                    if (err) {
                        console.error("Error updating patient into personas table:", err);
                        callback(error, null);
                    }
                    const doctorValues = [
                        doctorName,
                        doctorLastName,
                        doctorRut,
                    ]
                    db.query(sqlDoctor, doctorValues, (err, result) => {
                        if (err) {
                            console.error("Error updating doctor into personas table:", err);
                            callback(error, null);
                        }
                        const orderValues = [
                            creationDate,
                            fileNumber,
                            medicalCenter,
                            workType,
                            prothesis,
                            completitude,
                            color,
                            location,
                            indications,
                            billing,
                            billingDate,
                            licence,
                            orderId,
                        ]
                        db.query(sqlOrden, orderValues, (err, result) => {
                            if (err) {
                                console.error("Error updating into ordenes_de_trabajo table:", err);
                                callback(error, null);
                            }
                            const historialValues = [
                                fileNumber,
                                orderId
                            ]
                            db.query(sqlHistorial, historialValues, (err, result) => {
                                if (err) {
                                    console.error("Error updating into ordenes_de_trabajo table:", err);
                                    callback(error, null);
                                }
                                callback(null, orderId);
                            })
                        })
                    })
                })
            }
        });
    }


}




module.exports = OrdenesModel;
