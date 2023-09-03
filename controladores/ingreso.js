async function ingresoEndpoint(req, res, db, bcrypt) {
    const { mail, pass } = req.body;
    const data = req.body;

    if (!mail || !pass) {
      return res.status(400).json('falta el mail o la contraseña');
    }

   await db.select('mail', 'pass', 'tipo').from('loginJugador')
      .where('mail', '=', mail)
      .then(data => {
        const isValid = bcrypt.compareSync(pass, data[0].pass);

        if (isValid) {
          if(data[0].tipo === "jugador") {
            return db.select('*').from('jugador')
              .where('mail', '=',mail)
              .then(user => {
                res.status(200).json({"message": "Bienvenido a canchaApps " + user[0].nombre});
                console.log("message: Bienvenido a canchaApps " + user[0].nombre)
              })
              .catch(err => res.status(400).json('unable to get user'))
          }
          if(data[0].tipo === "administrador") {
            return db.select('*').from('administrador')
              .where('mail', '=',mail)
              .then(user => {
                res.status(200).json({"message": "Bienvenido a canchaApps " + user[0].nombre});
                console.log("message: Bienvenido a canchaApps " + user[0].nombre)
              })
              .catch(err => res.status(400).json('unable to get user'))
          }
        } else {
          res.status(400).json('wrong credentials')
        }
      })
      .catch(err => res.status(400).json('wrong credentials'))
  }
  
  module.exports = {
    ingresoEndpoint: ingresoEndpoint
  }