import Website from "../models/Website.js";
import client from '../database.js';

const websiteController = {

  all: async function(req, res) {
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
    } catch(error) {
      res.status(500).render('error');
    }
  },

  form: function(req, res) {
    res.render('add-site');
  },

  formAction: async function(req, res) {
    try {
      const website = new Website(req.body);
      // todo : c'est bien beau de créer un objet représentant le site, il faudrait aussi le faire persister en base de données
      res.redirect('/tomates/' + website.slug);
    } catch (error) {
      res.render('add-site', {
        message: error.message,
      });
    }
  },

  details: async function(req, res, next) {
    res.render('detail', {
      website: {},
    });
  },

};

export default websiteController;
