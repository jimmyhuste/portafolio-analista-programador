const express = require('express');
const router = express.Router();
const personaController = require('../controllers/crearPersonaController');
const verifyRoute = require("../middlewares/verificadorToken")
const uploadMiddleware = require("../middlewares/upload.middleware")
const validarPersona = require('../middlewares/validators/validatorPersona');
const multer = require('multer');

router.get('/persona', verifyRoute([1]), personaController.getAll);
router.get('/persona/:id', verifyRoute([1]), personaController.getById);
router.post('/persona', uploadMiddleware.single('imagen'), validarPersona(), verifyRoute([1]), personaController.create);
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Multer error occurred (e.g., file size exceeds limit)
        res.status(400).json({ error: 'Multer Error: ' + err.message });
    } else if (err) {
        console.log("asdasdd")
        // Other error occurred (e.g., file type not allowed)
        res.status(400).json({ error: err.message });
    } else {
        next(); // If no error, pass control to the next middleware
    }
});
router.put('/persona/:id', validarPersona(), verifyRoute([1]), personaController.update);
router.delete('/persona/:id', verifyRoute([1]), personaController.delete);

module.exports = router;
