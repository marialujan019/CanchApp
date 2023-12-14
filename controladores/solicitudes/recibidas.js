async function solicitudRecibida(req, res, db){
    
    const id_jugador = req.params.id;
    console.log("ID JUGADORRRRRRR: " + id_jugador)
    const equipos = await db.from('equipo').select('id_equipo, nombre_equipo').contains('id_jugadores', [id_jugador])
    const equipoData = equipos.data
    const id_equipos = equipoData.map(objeto => objeto.id_equipo);

    const misSolicitudes = await db.from('solicitudes')
        .select('*')
        .in('id_equipo', id_equipos)
    
    const solicitudes = misSolicitudes.data.filter(item => item.id_jugador !== id_jugador);

    const idJugadores = [...new Set(solicitudes.filter(item => item.id_jugador !== null).map(item => item.id_jugador))];

    const datosJugador = await db.from('jugador').select('*').in('id_jug', idJugadores);

    const solicitudesRecibidas = solicitudes.map(dato => ({
        ...dato,
        nombre: datosJugador.data.find(nombre => nombre.id_jug === dato.id_jugador).nombre,
        apellido: datosJugador.data.find(nombre => nombre.id_jug === dato.id_jugador).apellido,
        telefono: datosJugador.data.find(nombre => nombre.id_jug === dato.id_jugador).telefono,
        posicion: datosJugador.data.find(nombre => nombre.id_jug === dato.id_jugador).posicion,
        pierna_habil: datosJugador.data.find(nombre => nombre.id_jug === dato.id_jugador).pierna_habil,
        sexo: datosJugador.data.find(nombre => nombre.id_jug === dato.id_jugador).sexo,
        edad: calcularEdad(datosJugador.data.find(nombre => nombre.id_jug === dato.id_jugador).fecha_nac),
        nombre_equipo: equipoData.find(nombre => nombre.id_equipo === dato.id_equipo).nombre_equipo
      }));
   
    return res.json(solicitudesRecibidas.filter(item => item.id_jugador !== parseInt(id_jugador)));
    
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
    solicitudRecibida: solicitudRecibida
};