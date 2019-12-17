const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
const mongoose = require("mongoose");
require("../models/Usuario");
const Usuario = mongoose.model("usuarios");
const bcrypt = require("bcryptjs");


router.get("/registro", (req, res) => {
  res.render("usuarios/registro")
})

router.post("/registro", (req, res) => {
  var erros = [];

  if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
    erros.push({ texto: "Nome invalido!" })
  }

  if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
    erros.push({ texto: "E-mail invalido!" })
  }

  if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
    erros.push({ texto: "Senha invalido!" })
  }

  /*if(req.body.senha  > 3){
    console.log("teste1")
     erros.push({ texto: "Senha muito curta"})
  }*/

  if (req.body.senha != req.body.senha2) {
    erros.push({ texto: "As senhas nao coincidem!" })
  }

  if (erros.length > 0) {
    res.render("usuarios/registro", { erros: erros })
  } else {

    Usuario.findOne({ email: req.body.email }).then((usuario) => {
      if (usuario) {
        req.flash("error_msg", "Este usuario já esta cadastrado!")
        res.redirect("/usuarios/registro")
      } else {

        const novoUsuario = new Usuario({
          nome: req.body.nome,
          email: req.body.email,
          senha: req.body.senha
        })
        
        bcrypt.genSalt(10, (erros, salt) => {
          bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {

            if (erro) {
              req.flash("error_msg", "Houve um erro ao salvar este usuario!!")
              res.redirect("/registro")
            }

            novoUsuario.senha = hash;

            novoUsuario.save().then(() => {
              req.flash("sucess_msg", "Usuario salvo com sucessso!!!")
              res.redirect("/")
          
            }).catch((err) => {
              req.flash("error_msg", "Houve um erro ao tentar salvar o usuario caso o erro persitar entre em contato com o administrador!")
              res.redirect("/registro")
            })

          })

        }) 

      }
    }).catch((err) =>{
      req.flash("error_msg", "Houve um erro interno!! ")
      res.redirect("/registro") 
    })

  }

})


router.get("/login", (req, res) => {
  res.render("usuarios/login")
})

module.exports = router