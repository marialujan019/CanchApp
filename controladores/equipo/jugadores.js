async function jugadores(req, res, db){
    const jugadores = await db.from('equipo').select('id_jugadores').eq('id_equipo', req.params.id)
    const jugadoresList = jugadores.data.map(objeto => objeto.id_jugadores);    
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
    jugadoresEquipo: jugadores
};