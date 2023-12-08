async function crear(req, res, db) {
    try {
      const data = req.body;
  
       await db.from('equipo').upsert([
        {
          nombre_equipo: data.nombre_equipo,
          cant_jugador: data.cant_jugador,
          capitan: data.capitan,
          id_jugadores: data.id_jugadores,
          ubicacion: data.ubicacion,
        },
      ]);
      res.status(200).send({ "message": "equipo creado"});
    } catch (err) {
        console.error('Error en la conexión:', err);
    }
}
  
  module.exports = {
    crearEquipoEndpoint: crear,
  };
  