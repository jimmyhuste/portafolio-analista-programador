const dashboardModel = require('../models/dashboardModel');

const dashboardController = {};

dashboardController.getDashboardData = (req, res) => {
    const responseData = {};

    dashboardModel.getAdminCount((error, adminCount) => {
        if (error) {
            console.error('Error getting admin count:', error);
            responseData.admins = 'Error';
        } else {
            responseData.admins = adminCount;
        }

        dashboardModel.getLaboratoristCount((error, laboratoristCount) => {
            if (error) {
                console.error('Error getting laboratorist count:', error);
                responseData.labos = 'Error';
            } else {
                responseData.labos = laboratoristCount;
            }

            dashboardModel.getOrdersCount((error, ordersCount) => {
                if (error) {
                    console.error('Error getting orders count:', error);
                    responseData.orders = 'Error';
                } else {
                    responseData.orders = ordersCount;
                }

                dashboardModel.getEtapasCount((error, etapasCount) => {
                    if (error) {
                        console.error('Error getting etapas count:', error);
                        responseData.etapas = 'Error';
                    } else {
                        responseData.etapas = etapasCount;
                    }

                    dashboardModel.getEstadosCount((error, estadosCount) => {
                        if (error) {
                            console.error('Error getting estados count:', error);
                            responseData.estados = 'Error';
                        } else {
                            responseData.estados = estadosCount;
                        }

                        res.json({
                            responseData,
                            Status: 'Success',
                        });
                    });
                });
            });
        });
    });
};

module.exports = dashboardController;
