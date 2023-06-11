const express = require('express');
const router = express.Router();
const personaController = require('../controllers/crearPersonaController');
const verifyRoute = require("../middlewares/verificadorToken")

const validarPersona = require('../middlewares/validators/validatorPersona');


router.get('/persona', verifyRoute([1]), personaController.getAll);
router.get('/persona/:id', verifyRoute([1]), personaController.getById);
router.post('/persona', validarPersona(), verifyRoute([1]), personaController.create);
router.put('/persona/:id', validarPersona(), verifyRoute([1]), personaController.update);
router.delete('/persona/:id', verifyRoute([1]), personaController.delete);

module.exports = router;
