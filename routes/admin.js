const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Categoria");
const Categoria = mongoose.model("categorias");

router.get('/', (req, res) => {
   res.render("admin/index")
});

router.get('/posts', (req, res) => {
   res.send("Pagina de post")
});

router.get('/categorias/add', (req, res) => {
   res.render("admin/addcategorias");
})

router.post("/categorias/nova", (req, res) => {
   var erros = [];

   console.log("Inicio da validacao "+erros);

   if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
      erros.push({ texto : "Nome invalido!" })
   }

   console.log("passou pela primeira validacao");


   if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
      erros.push({ texto : "Slug invalido!" })
   }

   if (req.body.nome.length < 2) {
      erros.push({ texto : "Nome muito pequeno!" })
   }

   if (!erros.length > 0) {
      res.render("admin/addcategorias", { erros: erros })
   } else {
      const novaCategoria = {
         nome: req.body.nome,
         slug: req.body.slug
      }
      new Categoria(novaCategoria).save().then(() => {
         req.flash("sucess_msg", "Categoria criada com sucesso")
         res.redirect("/admin/categorias")
      }).catch((err) => {
         console.log("Erro ao salvar a categoria" + err)
         req.flash("error_msg", "Houver um erro ao salvar a categoria")
      });
   }
});

router.get('/categorias',(req, res)=>{
   res.render("admin/categorias")
});


/*
router.get('/categorias',(req, res)=>{
   Categoria.find().then((categorias) =>{
   res.render("/admin/categorias",{categorias: categorias})   
}).catch((err) => {
    req.flash("error","Houve um erro ao listar as categorias")
});*/

module.exports = router;