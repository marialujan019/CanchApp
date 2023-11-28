const express = require('express');
const knex = require('knex');
const bodyParser = require('body-parser');
const registroEndpoint = require('./controladores/jugador/registro');
const ingresoEndpoint = require('./controladores/jugador/ingreso')
const complejoEndpoint = require('./controladores/complejo');
const canchasEndpoint = require('./controladores/canchas/search')
const crearCanchaEndpoint = require('./controladores/canchas/crear')
const canchaEndpoint = require('./controladores/canchas/cancha')
const deleteCanchaEndpoint = require('./controladores/canchas/delete')
const updateCanchaEndpoint = require('./controladores/canchas/editar')
const crearAgendaEndpoint = require('./controladores/agenda/crear_agenda')
const crearEquipoEndpoint = require('./controladores/equipo/crear')

const bcrypt = require('bcrypt');
const cors = require('cors'); //permite la conexion entre el be y fe de manera local
const cookieParser = require('cookie-parser');
const app = express()
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const perfilEndpoint = require('./controladores/perfil/perfil');
const supabaseUrl = 'https://mspsbqmtjgzybpuvcdks.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zcHNicW10amd6eWJwdXZjZGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY4OTU2MjgsImV4cCI6MjAxMjQ3MTYyOH0.72O8fZHpPqN-rMC5saX1lSO7wxOU_LjIDQUsJxsck5Y';

//Conexión a la db
const db = createClient(supabaseUrl, supabaseKey);

app.use(cookieParser());

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "DELETE", "PUT"],
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

app.post('/search_canchas',  async (req, res) =>{
  canchasEndpoint.canchasEndpoint(req, res, db);
})

app.post('/crear_cancha', async (req, res) => {
  crearCanchaEndpoint.crearCanchaEndpoint(req, res, db);
})

app.post('/cancha', async (req, res) => {
  canchaEndpoint.canchaEndpoint(req, res, db);
})

app.delete('/borrar_cancha/:id', async(req, res) => {
  deleteCanchaEndpoint.deleteCanchaEndpoint(req, res, db);
})

app.put('/update_cancha/:id', async(req, res) => {
  updateCanchaEndpoint.updateCanchaEndpoint(req, res, db);
})

app.post('/registro', async (req, res)=>{
  registroEndpoint.registroEndpoint(req, res, db, bcrypt);
})

app.post('/perfil', async (req, res) => {
  perfilEndpoint.perfilEndpoint(req, res, db, bcrypt)
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

app.post('/crear_agenda', async(req, res) => {
  crearAgendaEndpoint.crearAgendaEndpoint(req, res, db);
})

//Equipo
app.post('/crear_equipo', async(req, res) => {
  crearEquipoEndpoint.crearEquipoEndpoint(req, res, db)
})

app.listen(3001)
console.log('Server on port', 3000)