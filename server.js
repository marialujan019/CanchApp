const express = require('express');
const knex = require('knex');
const bodyParser = require('body-parser');
const registroEndpoint = require('./controladores/jugador/registro');
const ingresoEndpoint = require('./controladores/jugador/ingreso')
const complejoEndpoint = require('./controladores/complejo');
const bcrypt = require('bcrypt');
const cors = require('cors'); //permite la conexion entre el be y fe de manera local
const cookieParser = require('cookie-parser');
const app = express()
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://mspsbqmtjgzybpuvcdks.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zcHNicW10amd6eWJwdXZjZGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY4OTU2MjgsImV4cCI6MjAxMjQ3MTYyOH0.72O8fZHpPqN-rMC5saX1lSO7wxOU_LjIDQUsJxsck5Y';

//Conexión a la db
const db = createClient(supabaseUrl, supabaseKey);

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

app.post('/registro', async (req, res)=>{
  registroEndpoint.registroEndpoint(req, res, db, bcrypt);
})

app.post('/ingreso', async (req, res) => {
  ingresoEndpoint.ingresoEndpoint(req, res, db, bcrypt);
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