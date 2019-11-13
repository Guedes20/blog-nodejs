// Carregar o dotenv
require('dotenv').config();

//Carregando modulos
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const admin = require('./routes/admin');
const path = require('path');

//Configurações
//bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//Handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//Mongoose
mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URL).then(() => {
   console.log("Conectado ao mongo")
}).catch((err) => {
   console.log("Erro ao se conectar ao mongo : " + err)
});

//Public
app.use(express.static(path.join(__dirname, 'public')));

//Rotas
app.use('/admin', admin);

//Outros
const _PORT = (process.env.PORT ||  9991);
app.listen(_PORT, () => {
   console.log("Servidor rodando na http://localhost:9991/admin");
})