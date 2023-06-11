const express = require('express');
const router = express.Router();
const OrdenesController = require('../controllers/ordenesController');
const validarOrdenes = require('../middlewares/validators/validarOrdenes');
const verifyRoute = require("../middlewares/verificadorToken")



router.get('/ordenes', verifyRoute([1,2]) , OrdenesController.getAll);
router.get('/ordenes/:id', verifyRoute([1,2]), OrdenesController.getById);
router.post('/ordenes', verifyRoute([1]) , validarOrdenes(), OrdenesController.create);
router.put('/ordenes/:id', verifyRoute([1,2]) , validarOrdenes(), OrdenesController.update);
router.delete('/ordenes/:id' ,verifyRoute([1]) , OrdenesController.deleteOrden);


module.exports = router;
