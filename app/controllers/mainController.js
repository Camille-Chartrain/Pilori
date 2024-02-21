import Website from "../models/Website.js";

const mainController = {

  home: async function (req, res, next) {
    try {
      const websites = await Website.find3();
      console.log(websites);
      res.render('home', {
        websites: websites,
      });
    }
    catch (error) {
      console.error(error.message);
      res.render('error');
    };
  },

  legals: function (req, res) {
    res.render('coming-soon', {
      title: 'Mentions légales',
    });
  },

  plan: function (req, res) {
    res.render('coming-soon', {
      title: 'Plan du site',
    });
  },

  contact: function (req, res) {
    res.render('coming-soon', {
      title: 'Contact',
    });
  },

  notFound: function (req, res) {
    res.status(404).render('error', {
      message: 'La page demandée n\'a pas été trouvée.',
    });
  }

};

export default mainController;
