async function invitacionesUpdate(req, res, db){
    const data = req.body

    const invitaciones = await db.from('invitaciones').select('*').eq('id_invitacion', data.id_invitacion).single()
    const equipo = await db.from('equipo').select('*').eq('id_equipo', invitaciones.data.id_equipo).single()

    await db.from('invitaciones').update({
        estado: data.estado
    }).eq('id_invitacion', data.id_invitacion)

    if(data.estado === "Aceptado") {
        const idJugadores = equipo.data.id_jugadores
        const id_solicitud = invitaciones.data.id_jugador_invitado
        idJugadores.push(id_solicitud)
        await db.from('equipo').update({
            id_jugadores: idJugadores
        }).eq('id_equipo', invitaciones.data.id_equipo)
    }
}


module.exports = {
    invitacionesUpdate: invitacionesUpdate
};