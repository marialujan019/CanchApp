const express = require('express');
const knex = require('knex');
const bodyParser = require('body-parser');
const registroEndpoint = require('./controladores/registro');
const complejoEndpoint = require('./controladores/complejo');
const bcrypt = require('bcrypt');
const cors = require('cors'); //permite la conexion entre el be y fe de manera local
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express()

//Conexión a la db
const db = knex({
    client: 'pg',
    connection: {
      //cambiar por el internal url
      connectionString: "postgres://mlujan:FvbE9Y3CEpdnL5PdO7JLEkoEcMLtVmx1@dpg-ciq6hbunqql4qa4911eg-a.oregon-postgres.render.com/canchappdb",
      ssl: true,
    }
  });

  app.use(cookieParser());
  app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true
}))

app.use(bodyParser.json());

const verifyUser = (req, res, next)=> {
  const token = req.cookies.token
  if(!token){
    return res.json({Message: "Need token"})
  } else {
    jwt.verify(token, 'our-jsonwebtoken-secret-key', (err, decoded)=> {
      if(err) {
        return res.json({Message: "Auth error"})
      } else {
        req.name = decoded.name; 
        next();
      }
    })
  }
}
app.get('/', verifyUser, (req, res)=> {
    return res.json({Status: "Respuesta ok"})
})

//Pegada de prueba para ver si funciona la conexion a la db
app.get('/hora', async (req, res)=> {
    db.raw('SELECT NOW()')
    .then(result => {
    res.send(result.rows[0].now); // Imprimir el resultado de NOW()

    })
    .catch(error => {
    console.error(error);
   
  });
})

app.post('/registro', async (req, res)=>{
  registroEndpoint.registroEndpoint(req, res, db, bcrypt);
})

app.post('/ingreso', async (req, res) => {
  const { mail, pass } = req.body;
  console.log(req.body)
  const userData = await db.select('mail', 'pass').from('loginJugador').where('mail', '=', mail);
  console.log(userData)
  const isValid = bcrypt.compareSync(pass, userData[0].pass);

  if (userData.length > 0 && isValid) {
      const playerData = await db.select('*').from('jugador').where('mail', '=', mail);
      const name = playerData[0].nombre
      const token = jwt.sign({name}, 'our-jsonwebtoken-secret-key', {expiresIn: '1d'});
      res.cookie('token', token)
      console.log(playerData[0].nombre)
      return res.json({Status: "Respuesta ok", nombre: playerData[0].nombre})
  } else {
      return res.json({Message: 'wrong credentials'});
  }
})

app.get('/logout', (req, res)=> {
  res.clearCookie('token');
  return res.json({Status: "Respuesta ok"})

})

app.post('/complejo', async (req, res) =>{
  complejoEndpoint.complejoEndpoint(req, res, bcrypt, db);
})



app.listen(3001)
console.log('Server on port', 3000)