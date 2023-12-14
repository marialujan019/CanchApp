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
const complejoCanchas  = require('./controladores/complejo/canchas');
const complejo = require('./controladores/complejo/search');
const crearSolicitud = require('./controladores/solicitudes/crear');
const crearInvitaciones = require('./controladores/invitaciones/crear');
const misEquipos = require('./controladores/equipo/equipos_jugador');
const popups = require('./controladores/mapa/popups');
const historial = require('./controladores/reservas/historial');
const jugadoresEquipo = require('./controladores/equipo/jugadores');
const jugadores = require('./controladores/jugador/jugadores');
const turnos = require('./controladores/agenda/turnos');
const turnosFecha = require('./controladores/agenda/turnos_fecha');
const buscarEquipos = require('./controladores/busquedas/buscar_equipos');

const bcrypt = require('bcrypt');
const cors = require('cors'); //permite la conexion entre el be y fe de manera local
const cookieParser = require('cookie-parser');
const app = express()
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const perfilEndpoint = require('./controladores/perfil/perfil');
const reservar = require('./controladores/reservas/reservar');
const update = require('./controladores/equipo/update');
const deleteSolicitud = require('./controladores/solicitudes/delete');
const soyCapitan = require('./controladores/equipo/soy_capitan');
const noSoyCapitan = require('./controladores/equipo/no_soy_capitan');
const eliminarJugador = require('./controladores/jugador/eliminar');

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

//Generales de usuarios
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

//Canchas
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

//Complejo
app.post('/complejo', async (req, res) =>{
  complejoEndpoint.complejoEndpoint(req, res, bcrypt, db);
})

app.post('/complejo/agenda/crear', async(req, res) => {
  crearAgendaEndpoint.crearAgendaEndpoint(req, res, db);
})

app.get('/complejo/agenda/turnos/:id', async(req, res) => {
  turnos.turnos(req, res, db);
})
app.get('/complejo/agenda/turnos/:id/:fecha', async(req, res) => {
  turnosFecha.turnosFecha(req, res, db);
})

app.get('/complejo/canchas/:id', async(req, res) => {
  complejoCanchas.complejoCanchas(req, res, db)
})

app.get('/complejo/:id', async(req, res) => {
  complejo.complejo(req, res, db)
})

//Equipo
app.post('/crear_equipo', async(req, res) => {
  crearEquipoEndpoint.crearEquipoEndpoint(req, res, db)
})

app.get('/equipo/mis_equipos/:id', async(req, res) => {
  misEquipos.misEquipos(req, res, db)
})

app.get('/equipo/soy_capitan/:id', async(req, res) => {
  soyCapitan.soyCapitan(req, res, db)
})

app.get('/equipo/no_soy_capitan/:id', async(req, res) => {
   noSoyCapitan.noSoyCapitan(req, res, db)
})

app.post('/equipo/update', async(req, res) => {
  update.update(req, res, db)
})

app.get('/equipo/jugadores/:id', async(req, res) => {
  jugadoresEquipo.jugadoresEquipo(req, res, db)
})

app.get('/equipo/buscar/:id_jugador', async(req, res) => {
  buscarEquipos.buscarEquipos(req, res, db)
})

//solicitudes
app.post('/solicitudes', async(req, res) => {
  crearSolicitud.solicitudesEndpoint(req, res, db)
})

app.delete('/solicitudes/borrar/:id_jugador/:id_equipo', async(req, res) => {
  deleteSolicitud.deleteSolicitud(req, res, db)
})

//invitaciones
app.post('/invitaciones', async(req, res) => {
  crearInvitaciones.invitacionesEndpoint(req, res, db)
})

//Mapa
app.get('/popups', async(req, res) => {
  popups.popups(req, res, db)
})

//reservas
app.get('/reservas/historial/:id', async(req, res) => {
  historial.historial(req, res, db)
})

app.post('/reservar', async(req, res) => {
  reservar.reservar(req, res, db)
})

//jugadores
app.get('/jugadores/:id', async(req, res) => {
  jugadores.jugadores(req, res, db)
})

app.post('/jugadores/:id/:equipo', async(req, res) => {
  eliminarJugador.eliminarJugador(req, res, db)
})

app.listen(3001)
console.log('Server on port', 3000)