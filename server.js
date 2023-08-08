const express = require('express');
const knex = require('knex');
const bodyParser = require('body-parser');
const registroEndpoint = require('./controladores/registro');
const ingresoEndpoint = require('./controladores/ingreso');
const complejoEndpoint = require('./controladores/complejo');
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
  registroEndpoint.registroEndpoint(req, res, db, bcrypt);
})

app.post('/ingreso', async (req, res) => {
  ingresoEndpoint.ingresoEndpoint(req, res, db, bcrypt);
}
)

app.post('/complejo', async (req, res) =>{
  complejoEndpoint.complejoEndpoint(req, res, bcrypt, db);
})



app.listen(3000)
console.log('Server on port', 3000)