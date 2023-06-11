const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const routesLogin = require('./routes/Login.routes');
const routesPersonas = require('./routes/Persona.routes');
const routesOrder = require('./routes/Ordenes.routes');
const routesDashboard = require('./routes/Dashboard.routes');

const cors = require('cors')

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static('public'));
app.use(cors({
  origin: "http://127.0.0.1:5173",
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true // Allow including cookies with requests
}));

//app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routesLogin, routesPersonas, routesOrder, routesDashboard);

app.listen(8081, () => {
  console.log('Servidor escuchando en el puerto 8081');
});

