const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const admin = require("./routes/admin");
const path = require("path");
const session = require("express-session")
const flash = require("connect-flash");

//Configurações
   //Sessao
     app.use(session({
        secret:"cursodenode",
        resave:true,
        saveUninitialized:true
     }))
     
//Flash
app.use(flash())

//Middleware
app.use((req, res, next) => {
   res.locals.success_msg = req.flash("sucess_msg")
   res.locals.error_msg = req.flash("error_msg")
   next()
})

//bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//Handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//Mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/blogapps' , { useNewUrlParser: true }).then(() => {
   console.log("Conectado ao mongo")
}).catch((err) => {
   console.log("Erro ao se conectar ao mongo : " + err)
});

//Public
app.use(express.static(path.join(__dirname, 'public')));

//Rotas
app.use('/admin', admin);

//Outros
const _PORT = 9991;
app.listen(_PORT, () => {
   console.log("Servidor rodando na http://localhost:9991/admin");
})