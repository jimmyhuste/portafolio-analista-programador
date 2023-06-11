const OrdenesModel = require('../models/ordenesModel');
const validarRut = require('../helpers/validarRut');

class OrdenesController {


    static getAll(req, res) {
        OrdenesModel.get((error, results) => {
            if (error) {
                res.status(500).json({
                    estado: 'Error',
                    message: error
                });
            } else {
                res.json(results);
            }
        });

    }

    static getById(req, res) {
        const { id } = req.params;

        OrdenesModel.getById(id)
            .then((orden) => {
                if (!orden) {
                    res.status(404).json({ error: 'Orden de trabajo no encontrada' });
                    return;
                }

                res.json(orden);
            })
            .catch((error) => {
                console.error('Error:', error);
                res.status(500).json({ error: 'Error al obtener la orden de trabajo' });
            });
    }

    static create(req, res) {
        const { nombre, apellido, fecha_nacimiento, fecha_creacion, etapa,
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
            licencia } = req.body;
       

        if ( validarRut(rut_paciente)) {
            OrdenesModel.create(
                {
                    nombre, apellido, fecha_nacimiento, fecha_creacion,etapa,
                    numero_ficha,rut_paciente,centro,rut_doctor,tipo_trabajo,protesis,completitud,
                    color,ubicacion,indicaciones,tipo_factura,fecha_facturacion,licencia
                },
                (error, ordenId) => {
                    if (error) {
                        res.status(400).json({
                            estado: 'Error',
                            message: error,
                        });
                    } else {
                        res.json({
                            message: 'Orden de trabajo creada exitosamente',
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


    }
    static deleteOrden(req, res) {
        const { id } = req.params;

        OrdenesModel.deleteOrden(id)
            .then((deletedRows) => {
                if (deletedRows === null) {
                    res.status(404).json({ error: 'Orden de trabajo no encontrada' });
                    return;
                }

                res.json({ message: 'Orden de trabajo eliminada exitosamente', id: id });
            })
            .catch((error) => {
                console.error('Error:', error);
                res.status(500).json({ error: 'Error al eliminar la orden de trabajo' });
            });
    }


    static update(req, res) {
        const orderId = req.params.id;
        const data = req.body;
        const { rut_paciente } = req.body;

       
        if (validarRut(rut_paciente)) {
            OrdenesModel.update(orderId, data, (error, orderId) => {
                if (error) {
                    res.status(400).json({
                        estado: 'Error',
                        message: error.message
                    });
                } else {
                    res.json({
                        message: 'Orden de trabajo actualizada exitosamente',
                    });
                }
            });
        } else {
            res.status(400).json({
                estado: 'Rut inválido',
                message: 'El Rut debe tener el siguiente formato: [ 11111111-1 ]',
            });
        }



    }



}

module.exports = OrdenesController;
