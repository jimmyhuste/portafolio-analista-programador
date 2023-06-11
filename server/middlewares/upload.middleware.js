const multer = require('multer');

// Configuración de Multer para guardar las imágenes en una carpeta específica
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images'); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.originalname}`;
    cb(null, filename);
  },
});

// Middleware de carga de imagen utilizando Multer
const uploadMiddleware = multer({ storage });

module.exports = uploadMiddleware;
