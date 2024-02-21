import express from 'express';
import session from 'express-session';
import * as dotenv from 'dotenv';
import router from './app/router.js';
import addUserData from './app/middlewares/addUserData.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', './app/views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: process.env.SECRET_POUR_EXPRESS_SESSION
}));

app.use(addUserData);

app.use(router);

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
