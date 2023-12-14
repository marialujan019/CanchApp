const { compareSync } = require("bcrypt");

async function eliminarJugador(req, res, db){
    const id_jugador = req.params.id
    const id_equipo = req.params.equipo
    console.log(id_jugador)

    const id_jugadores = await db.from('equipo')
    .select('id_jugadores')
    .eq('id_equipo', id_equipo)
    .single();

    console.log(id_jugadores)
    // Extraer el array de id_jugadores del equipo
    const idJugadoresActuales = id_jugadores.data.id_jugadores || [];
    console.log(idJugadoresActuales)
    // Filtrar el array para eliminar el idJugador
    const nuevosIdJugadores = idJugadoresActuales.filter(id => id !== parseInt(id_jugador));

    console.log(nuevosIdJugadores)

    // Actualizar la fila con el nuevo array
    await db.from('equipo')
      .update({ id_jugadores: nuevosIdJugadores })
      .eq('id_equipo', id_equipo)
      .single();
    
      const jugadores = await db.from('equipo').select('id_jugadores').eq('id_equipo', req.params.equipo)
      const jugadoresList = jugadores.data.map(objeto => objeto.id_jugadores);    
      console.log("Jugadires actuales: " + jugadoresList)
      const jugadoresDatos = await db.from('jugador').select('*').in('id_jug', [jugadoresList])
  
      const jugadoresConEdad = jugadoresDatos.data.map(jugador => ({
          ...jugador,
          edad: calcularEdad(jugador.fecha_nac)
        }));

      return res.json(jugadoresConEdad);
}

function calcularEdad(fechaNacimiento) {
    const fechaActual = new Date();
    const fechaNac = new Date(fechaNacimiento);
  
    let edad = fechaActual.getFullYear() - fechaNac.getFullYear();
    const mesActual = fechaActual.getMonth() + 1;
    const mesNac = fechaNac.getMonth() + 1;
  
    if (mesActual < mesNac || (mesActual === mesNac && fechaActual.getDate() < fechaNac.getDate())) {
      edad--;
    }
  
    return edad;
  }

module.exports = {
    eliminarJugador: eliminarJugador
};