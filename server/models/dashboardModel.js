const db = require('../database/db');

const dashboardModel = {};

dashboardModel.getAdminCount = (callback) => {
  const adminCountQuery = 'SELECT COUNT(id) AS admins FROM personas WHERE rol_id = 1';
  db.query(adminCountQuery, (error, result) => {
    if (error) {
      console.error('Error executing adminCountQuery:', error);
      callback(error, null);
    } else {
      const adminCount = result[0].admins;
      callback(null, adminCount);
    }
  });
};

dashboardModel.getLaboratoristCount = (callback) => {
  const labCountQuery = 'SELECT COUNT(id) AS labos FROM personas WHERE rol_id = 2';
  db.query(labCountQuery, (error, result) => {
    if (error) {
      console.error('Error executing labCountQuery:', error);
      callback(error, null);
    } else {
      const laboratoristCount = result[0].labos;
      callback(null, laboratoristCount);
    }
  });
};

dashboardModel.getOrdersCount = (callback) => {
  const orderCountQuery = 'SELECT COUNT(id) AS orders FROM ordenes_de_trabajo';
  db.query(orderCountQuery, (error, result) => {
    if (error) {
      console.error('Error executing orderCountQuery:', error);
      callback(error, null);
    } else {
      const ordersCount = result[0].orders;
      callback(null, ordersCount);
    }
  });
};

module.exports = dashboardModel;
