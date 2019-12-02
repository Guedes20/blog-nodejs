const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
const mongoose = require("mongoose");
require("../models/Categoria");
const Categoria = mongoose.model("categorias");



router.get('/', (req, res) => {
   res.render("admin/index")
});

router.get('/posts', (req, res) => {
   res.send("Pagina de post")
});

router.get('/categorias', (req, res) => {
   Categoria.find().then((categorias) => {
      res.render("admin/categorias", { categorias: categorias })
   }).catch((err) => {
      req.flash('error_msg', 'Houve um erro ao listar as categorias')
   })
});

router.get('/categorias/add', (req, res) => {
   res.render("admin/addcategorias");
})

router.post("/categorias/nova", (req, res) => {
   var erros = [];
   if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
      console.log("Erro 1")
      erros.push({ texto: "Nome invalido!" })
   }
   if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
      console.log("Erro 2")
      erros.push({ texto: "Slug invalido!" })
   }
   if (req.body.nome.length < 2) {
      console.log("Erro 3")
      erros.push({ texto: "Nome muito pequeno!" })
   }
   if (erros.length > 0) {
      console.log("Houve um erro"+ erros.length > 0)
      res.render("admin/addcategorias", { erros: erros })
   } else {
      console.log("vai tentar salvar")
      const novaCategoria = {
         nome: req.body.nome,
         slug: req.body.slug
      }

      new Categoria(novaCategoria).save().then(() => {
         console.log(" Categoria salva com sucesso ")
         req.flash("sucess_msg", "Categoria criada com sucesso")
         res.redirect("/admin/categorias")
      }).catch((err) => {
         console.log("Erro ao salvar a categoria" + err)
         req.flash("error_msg", "Houver um erro ao salvar a categoria")
         res.redirect("/admin")
      });

   }

});

module.exports = router;