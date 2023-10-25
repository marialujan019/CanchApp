const jwt = require('jsonwebtoken');

async function ingresoEndpoint(req, res, db, bcrypt) {
  const { mail, pass } = req.body;
  const { data, error } = await db.from('login').select('*').eq('mail', mail).single();

  const isValid = bcrypt.compareSync(pass, data.contrasena);

  if (isValid) {   
    console.log(mail)
    var tipo = data.tipo
    const result = await db.from(tipo).select('*').eq('mail', mail).single();

    if (result.error) {
      return res.json({ Message: 'unable to get user' });
    }

    const name = result.data.nombre;
    const id = result.data.id_admin;

    const token = jwt.sign({name}, 'our-jsonwebtoken-secret-key', {expiresIn: '100d'});
    res.cookie('token', token)

    return res.json({ Status: 'Respuesta ok', nombre: name, tipo: tipo, id: id });

  } else {
      return res.json({Message: 'wrong credentials'});
  }
  }
  
  module.exports = {
    ingresoEndpoint: ingresoEndpoint
  }