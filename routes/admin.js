const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
const mongoose = require("mongoose");
require("../models/Categoria");
const Categoria = mongoose.model("categorias");
require("../models/Postagem");
const Postagem = mongoose.model("postagens");
const {eAdmin}  = require("../helper/eAdmin")

router.get('/', eAdmin, (req, res) => {
   res.render("admin/index")
});

router.get('/categorias', eAdmin,  (req, res) => {
   Categoria.find().sort({ nome: "asc" }).then((categorias) => {
      res.render("admin/categorias", { categorias: categorias })
   }).catch((err) => {
      req.flash('error_msg', 'Houve um erro ao listar as categorias')
   })
});

router.get('/categorias/add', eAdmin, (req, res) => {
   res.render("admin/addcategorias");
})

router.post("/categorias/nova", eAdmin, (req, res) => {
   var erros = [];
   if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
      erros.push({ texto: "Nome invalido!" })
   }
   if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
      erros.push({ texto: "Slug invalido!" })
   }
   if (req.body.nome.length < 2) {
      erros.push({ texto: "Nome muito pequeno!" })
   }
   if (erros.length > 0) {
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
         req.flash("error_msg", "Houver um erro ao salvar a categoria")
         res.redirect("/admin")
      });

   }

});

router.get('/categorias/edit/:id', eAdmin, (req, res) => {
   Categoria.findOne({ _id: req.params.id }).then((categoria) => {
      res.render("admin/editcategorias", { categoria: categoria })
   }).catch((err) => {
      req.flash("error_msg", "Esta categoria não existe")
      res.redirect("/admin/categorias")
   })
});

router.post("/categorias/edit", eAdmin, (req, res) => {

   Categoria.findOne({ _id: req.body.id }).then((categoria) => {
      // validar o formulario aqui.
      categoria.nome = req.body.nome
      categoria.slug = req.body.slug

      categoria.save().then(() => {
         req.flash("sucess_msg", "Categoria editada com sucesso!")
         res.redirect("/admin/categorias")
      }).catch((err) => {
         req.flash("error_msg", "Houve um error interno ao editar esta categoria!")
      })

   }).catch((err) => {
      req.flash("error_msg", "Error ao editar esta categoria" + err)
      res.redirect("/admin/categorias")
   })
});

router.post("/categorias/deletar", eAdmin, (req, res) => {
   Categoria.remove({ _id: req.body.id }).then(() => {
      req.flash("sucess_msg", "Categoria removida com sucesso!")
      res.redirect("/admin/categorias")
   }).catch((err) => {
      req.flash("error_msg", "Error ao deletar esta categoria " + err)
      res.redirect("/admin/categorias")
   })
})

//Rotas Postagens
router.get("/postagens", eAdmin, (req, res) => {
   Postagem.find().populate("categoria").sort({ data: "desc" }).then((postagens) => {
      res.render("admin/postagens", { postagens: postagens })
   }).catch((err) => {
      req.flash("error_msg", "Houve um erro ao listar as postagens")
      res.redirect("/admin")
   })

})

router.get("/postagens/add", eAdmin, (req, res) => {
   Categoria.find().then((categorias) => {
      res.render("admin/addpostagens", { categorias: categorias })
   }).catch((err) => {
      console.log(categorias)
      req.flash("error_msg", "Houve um erro ao carregar o formulario")
      res.redirect("/admin/postagens")
   })
})


router.post("/postagens/nova", eAdmin, (req, res) => {
   //Fazer uma validacao
   var erros = [];

   if (req.body.categoria == "0") {
      erros.push({ texto: "Categoria invalida, resgistre uma categoria" });
   }

   if (erros.length > 0) {
      res.render("admin/addpostagens", { erros: erros })
   } else {
      const novaPostagem = {
         titulo: req.body.titulo,
         descricao: req.body.descricao,
         conteudo: req.body.conteudo,
         categoria: req.body.categoria,
         slug: req.body.slug
      }

      new Postagem(novaPostagem).save().then(() => {
         console.log(novaPostagem)
         req.flash("sucess_msg", "Postagem salva com sucesso!")
         res.redirect("/admin/postagens")

      }).catch((err) => {
         req.flash("error_msg", "Houve um erro ao salvar a postagem")
         res.redirect("/admin/postagens")
      })

   }
})

router.get('/postagens/edit/:id', eAdmin, (req, res) => {
   Postagem.findOne({ _id: req.params.id }).then((postagem) => {
      Categoria.find().then((categorias) => {
         res.render("admin/editpostagens", { categorias: categorias, postagem: postagem })
      }).catch((err) => {
         req.flash("error_msg", "Houve um erro ao carregar as categoria para o formulario de  edição .")
         res.redirect("/admin/postagens")
      })
   }).catch((err) => {
      req.flash("error_msg", "Houve um erro ao carregar o formulario de  edição .")
      res.redirect("/admin/postagens")
   })

   router.post('/postagens/edit', (req, res) => {
      //Fazer uma validacao
  
      Postagem.findOne({_id: req.body.id}).then((postagem)=>{
            postagem.titulo =  req.body.titulo
            postagem.slug =  req.body.slug
            postagem.descricao =  req.body.descricao
            postagem.conteudo = req.body.conteudo
            postagem.categoria = req.body.categoria

            postagem.save().then(()=>{
               req.flash("sucess_msg", "Postagem editada com sucesso!")
               res.redirect("/admin/postagens")
            }).catch((err)=>{
               req.flash("error_msg", "Houve um erro interno.")
               res.redirect("/admin/postagens")                
            })
      }).catch((err) =>{
         req.flash("error_msg", "Houve um erro ao editar a postagem .")
         res.redirect("/admin/postagens")
      })

   })
})

router.get('/postagens/deletar/:id', eAdmin, (req, res) => {
   Postagem.deleteMany({_id: req.params.id}).then(() => {
      req.flash("sucess_msg", "Postagem removida com sucesso!")
      res.redirect("/admin/postagens")
   }).catch((err)=>{
         req.flash("error_msg","Houve um erro interno" )
         res.redirect();
      }) 

})

module.exports = router;