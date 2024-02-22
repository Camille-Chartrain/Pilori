//import client from '../database.js';
import User from '../models/User.js';


const userController = {

  profil: async function (req, res) {
    try {
      console.log("nous sommes dans le try du controller profil");
      console.log(req.session);
      console.log("essai affichage de l'id");
      console.log(req.session.userId);
      console.log("affichage de l'id de session?");
      console.log(req.session.id);
      const user = await User.read(req.session.userId);
      console.log("nous sommes dans le controller profil");
      console.log("affichage de l'objet avant passage des données dans la vue");
      console.log(user);

      res.render('profil', { user: user });
      console.log("affichage de l'objet après passage des données dans la vue");
      console.log(user);
    }
    catch (error) {
      console.log(error.message);
      res.render('error');
    }
  },

};

export default userController;
