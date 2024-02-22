import Website from "../models/Website.js";
import client from '../database.js';

const websiteController = {

  all: async function (req, res) {
    try {
      if (req.query.keywords) {
        const filteredWebsites = await client.query('SELECT * FROM website WHERE title ILIKE $1', [`%${req.query.keywords}%`]);
        if (filteredWebsites.rowCount > 0) {
          res.render('list', {
            title: 'Résultat de la recherche',
            websites: filteredWebsites.rows,
          });
        }
        else {
          res.render('list', {
            title: 'Aucun résultat',
            websites: [],
          });
        }
      }
      else {
        const websites = await client.query('SELECT * FROM website ORDER BY id DESC');
        res.render('list', {
          title: 'Toutes les tomates',
          websites: websites.rows,
        });
      }
    } catch (error) {
      res.status(500).render('error');
    }
  },

  form: function (req, res) {
    res.render('add-site');
  },

  formAction: async function (req, res) {
    try {
      //instanciation des infos reçues dans la requête
      //car nous allons appeler une méthode non statique cad une méthode qui a besoin de "this", donc besoin d'une instance à qui fait référence ce "this", dans la méthode.
      const website = new Website(req.body);
      // todo : c'est bien beau de créer un objet représentant le site, il faudrait aussi le faire persister en base de données. DONC =>
      //exécution de la fonction create dispo depuis l'instance website (objet) pour enregistrer les infos dans la bdd
      //la methode create va également rajouter une info à mon instance, son id
      await website.create();
      //redirection vers le controller paramétré "details" qui sert la page de détail des sites par URL /tomates/slug de notre nouveau site
      //mon instance website ici s'est vue rajouter un id par la méthode create
      res.redirect('/tomates/' + website.slug);
    } catch (error) {
      res.render('add-site', {
        message: error.message,
      });
    }
  },

  details: async function (req, res) {
    try {
      const website = await Website.findPage(req.params.slug);
      console.log("nous sommes dans le controller detail");
      console.log("affichage de l'objet avant passage des données dans la vue");
      console.log(website);
      res.render('detail', { website: website },
      );
      console.log("affichage de l'objet après passage des données dans la vue");
      console.log(website);
    } catch (error) {
      console.log(error.message);
      res.render('error');
    }
  },

};

export default websiteController;
