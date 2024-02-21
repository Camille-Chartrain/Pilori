const userController = {
  
  profil: async function(req, res) {
    res.render('profil', { user: {} });
  },

};

export default userController;
