async function misReservas(req, res, db){
    const equipos = await db.from('equipo').select('id_equipo, nombre_equipo').contains('id_jugadores', [req.params.id])
    const equipoData = equipos.data
    const id_equipos = equipoData.map(objeto => objeto.id_equipo);
    
    const reservas = await db.from('reservas').select('*').in('id_equipo', id_equipos);
    const arregloIdAgenda = [...new Set(reservas.data.filter(item => item.id_agenda !== null).map(item => item.id_agenda))];

    const agenda = await db.from('agenda').select('*').in('id_agenda', arregloIdAgenda);
    const arregloIdComplejos = [...new Set(agenda.data.filter(item => item.id_complejo !== null).map(item => item.id_complejo))];
    const complejoData = await db.from('complejo').select('*').in('id_complejo', arregloIdComplejos);

    const arregloIdCanchas = [...new Set(agenda.data.filter(item => item.id_cancha !== null).map(item => item.id_cancha))];
    const canchaData = await db.from('cancha').select('*').in('id_cancha', arregloIdCanchas);

    const nuevoArreglo = agenda.data.map(item => ({ ...item, estado: item.disponibilidad }));
    nuevoArreglo.forEach(item => delete item.disponibilidad);
   
    const nombreEquipos = nuevoArreglo.map(dato => ({
        ...dato,
        nombre_equipo: equipoData.find(nombre => nombre.id_equipo === dato.id_equipo).nombre_equipo
      }));
    
    nombreEquipos.forEach(item => delete item.id_equipo);

    const datosComplejo = nombreEquipos.map(dato => ({
        ...dato,
        nombre_complejo: complejoData.data.find(nombre => nombre.id_complejo === dato.id_complejo).nombre_complejo,
        direccion: complejoData.data.find(nombre => nombre.id_complejo === dato.id_complejo).direccion,
        telefono: complejoData.data.find(nombre => nombre.id_complejo === dato.id_complejo).telefono
    }));

    const datosCancha = datosComplejo.map(dato => ({
        ...dato,
        nombre_cancha: canchaData.data.find(nombre => nombre.id_cancha === dato.id_cancha).nombre_cancha
    }));    
    
    datosCancha.forEach(item => delete item.id_agenda);
    datosCancha.forEach(item => delete item.id_cancha);
    datosCancha.forEach(item => delete item.id_complejo);

    return res.json(datosCancha);
}

module.exports = {
    misReservas: misReservas
};