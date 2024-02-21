async function invitacionEnviada(req, res, db){
    
    const id_jugador = req.params.id;
    const invitaciones = await db.from('invitaciones').select('*').eq('id_capitan', parseInt(id_jugador))
    const idEquipos = [...new Set(invitaciones.data.filter(item => item.id_equipo !== null).map(item => item.id_equipo))];
    const equipoData = await db.from('equipo').select('*').in('id_equipo', idEquipos);
    const idJugadores = [...new Set(invitaciones.data.filter(item => item.id_jugador_invitado !== null).map(item => item.id_jugador_invitado))];
    const datosJugador = await db.from('jugador').select('*').in('id_jug', idJugadores);

    const invitacionesRecibidas = invitaciones.data.map(dato => ({
        ...dato,
        nombre: datosJugador.data.find(nombre => nombre.id_jug === dato.id_jugador_invitado).nombre,
        apellido: datosJugador.data.find(nombre => nombre.id_jug === dato.id_jugador_invitado).apellido,
        telefono: datosJugador.data.find(nombre => nombre.id_jug === dato.id_jugador_invitado).telefono,
        posicion: datosJugador.data.find(nombre => nombre.id_jug === dato.id_jugador_invitado).posicion,
        pierna_habil: datosJugador.data.find(nombre => nombre.id_jug === dato.id_jugador_invitado).pierna_habil,
        sexo: datosJugador.data.find(nombre => nombre.id_jug === dato.id_jugador_invitado).sexo,
        edad: calcularEdad(datosJugador.data.find(nombre => nombre.id_jug === dato.id_jugador_invitado).fecha_nac),
        nombre_equipo: equipoData.data.find(nombre => nombre.id_equipo === dato.id_equipo).nombre_equipo
      }));
      const filterEstado = invitacionesRecibidas.filter(item => item.estado == "Pendiente")
    return res.json(filterEstado);
    
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
    invitacionEnviada: invitacionEnviada
};