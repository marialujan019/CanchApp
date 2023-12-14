async function solicitudUpdate(req, res, db){
    const data = req.body

    const solicitud = await db.from('solicitudes').select('*').eq('id_solicitud', data.id_solicitud).single()
    const equipo = await db.from('equipo').select('*').eq('id_equipo', solicitud.data.id_equipo).single()

    await db.from('solicitudes').update({
        estado: data.estado
    }).eq('id_solicitud', data.id_solicitud)

    if(data.estado === "Aceptado") {
        const idJugadores = equipo.data.id_jugadores
        const id_solicitud = solicitud.data.id_jugador
        idJugadores.push(id_solicitud)
        await db.from('equipo').update({
            id_jugadores: idJugadores
        }).eq('id_equipo', solicitud.data.id_equipo)
    }
}


module.exports = {
    solicitudUpdate: solicitudUpdate
};