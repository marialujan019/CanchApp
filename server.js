const express = require('express');
const knex = require('knex');
const bodyParser = require('body-parser');
const register = require('./controladores/registro');
const bcrypt = require('bcrypt');
const cors = require('cors'); //permite la conexion entre el be y fe de manera local

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


app.use(cors());

app.use(bodyParser.json());
app.get('/', (req, res)=> {
    res.send('Hola')
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
  //TODO: cuando tengamos el modelado de la db mover al controler y validar la data.
  const data = req.body
  if(!data){
      res.status(400).json({"message":http.STATUS_CODES[400]})
      return;
  }
  try {
      await db("registro").insert(data)
      res.status(200).json({"message":"Created","data":data})
  } catch (error) {
      res.status(500).send({message:http.STATUS_CODES[500]})
  }
})

//app.post('/ingreso', signin.handleSignin(db))

app.listen(3000)
console.log('Server on port', 3000)