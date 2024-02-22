import validator from "validator";
import slugify from "slugify";
import client from "../database.js";

class Website {

  #id;
  #title;
  #slug;
  #description;
  #address;
  #device;
  #level;
  #user_id;

  constructor(config) {
    this.id = config.id;
    this.title = config.title;
    this.slug = slugify(config.title, {
      lower: true,
      strict: true,
    });
    this.description = config.description;
    this.address = config.address;
    this.device = config.device;
    this.level = config.level;
    this.user_id = config.user_id;
  }

  get id() {
    return this.#id;
  }

  get title() {
    return this.#title;
  }

  get slug() {
    return this.#slug;
  }

  get description() {
    return this.#description;
  }

  get address() {
    return this.#address;
  }

  get device() {
    return this.#device;
  }

  get level() {
    return this.#level;
  }

  get user_id() {
    return this.#user_id;
  }

  set id(value) {
    if (typeof value !== 'number' && typeof value !== 'undefined') {
      throw new Error('Id incorrect');
    }
    this.#id = value;
  }

  set title(value) {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error('Titre incorrect');
    }
    this.#title = value.trim();
  }

  set slug(value) {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error('Slug incorrect');
    }
    this.#slug = value.trim();
  }

  set description(value) {
    this.#description = value;
  }

  set address(value) {
    if (!validator.isURL(value)) {
      throw new Error('Adresse incorrecte');
    }
    this.#address = value;
  }

  set device(value) {
    const allowedValues = ['Mobile', 'Ordinateur', 'Lecteur d\'écran'];
    if (typeof value !== 'undefined' && !allowedValues.includes(value)) {
      throw new Error(`3 valeurs autorisées : ${allowedValues.join(', ')}`);
    }
    this.#device = value;
  }

  set level(value) {
    const allowedValues = ['Bloquant', 'Gênant', 'Casse-tête'];
    if (typeof value !== 'undefined' && !allowedValues.includes(value)) {
      throw new Error(`3 valeurs autorisées : ${allowedValues.join(', ')}`);
    }
    this.#level = value;
  }

  set user_id(value) {
    this.#user_id = value;
  }

  async create(idSession) {
    //séparation de la requête et de ses valeurs grâce au module pg pour sécuriser la requête, évite les injections de code potentielles des users.
    const text = `
      INSERT INTO website ("title", "slug", "description", "address", "device", "level","user_id")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id;
    `;
    const values = [this.title, this.slug, this.description, this.address, this.device, this.level, idSession];
    //requête qui envoie ces infos en bdd
    const result = await client.query(text, values);
    console.log("j'affiche ce que la requête a retourné");
    console.log(result);
    //  la requête nous retourne un objet, il contient une propriété rows
    console.log("j'affiche la propriété rows");
    console.log(result.rows);
    console.log("j'affiche la valeur de la propriété rows");
    console.log(result.rows[0].id);
    //la requête a envoyé les infos en bdd, l'id a été créé automatiquement en bdd, nous allons maintenant le récupérer pour l'associer à notre instance website
    // comme nous avons écrit "await website.create();" dans notre controller, nous allons jusqu'au bout de l'éxecution de la methode create avant de passer à la ligne suivante, donc l'id sera bien ajouté à l'instance website avant la ligne "res.redirect('/tomates/' + website.slug);".
    this.#id = result.rows[0].id;
    //on rajoute la propriété user_id à notre instance
    this.#user_id = idSession;
    console.log("affichage de notre instance avec sa nouvelle propriété userId");
    console.log(Website.userId);
  }

  static async read(id) {
    const text = `
      SELECT * FROM website
      WHERE id = $1;
    `;
    const values = [id];
    const result = await client.query(text, values);
    if (result.rowCount > 0) {
      return new Website(result.rows[0]);
    }
    else {
      throw new Error('Website non trouvé');
    }
  }

  static async find3() {
    // On execute notre requete SQL
    const result = await client.query(`
    SELECT *
    FROM "website"
    ORDER BY "id" DESC
    LIMIT 3;
    `);
    // On recupere simplement la liste des 3 sites 
    const websites = result.rows;
    //result.rows donne une liste d'objets, mais qui serait modifiable sans passer par la classe plus tard,
    // donc nous le rangeons dans un tableau en le faisant passer par la classe.
    //maintenant nous avons un tableau d'objets privés

    // Pour chaque sites, je veux creer un nouvel objet provenant de classe Websites
    const websitesObj = [];
    // Pour chaque agence contenu dans la bdd
    for (const website of websites) {
      // J'instancie un nouvel objet grace a ma classe
      websitesObj.push(new Website(website));
    }
    return websitesObj;
  }

  static async findPage(slug) {
    console.log('nous sommes dans dans la methode findPage');
    const text = `
        SELECT * 
        FROM "website"
        WHERE "slug" = $1; 
        `;
    const value = [slug];
    const result = await client.query(text, value);
    if (result.rowCount > 0) {
      return new Website(result.rows[0]);
    }
    else {
      throw new Error('Website non trouvé');
    }
  }



  async update() {
    const text = `
      UPDATE website 
      SET 
        "title" = $1,
        "slug" = $2,
        "description" = $3,
        "address" = $4,
        "device" = $5,
        "level" = $6
      WHERE id = $7;
    `;
    const values = [this.name, this.slug, this.description, this.address, this.device, this.level, this.id];
    client.query(text, values);
  }

  async delete() {
    const text = `
      DELETE FROM website 
      WHERE id = $1;
    `;
    const values = [this.id];
    client.query(text, values);
  }

}

export default Website;
