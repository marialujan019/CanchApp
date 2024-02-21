async function buscarEquiposInvitar(req, res, db) {
    const data = req.params;
    const id_jugador = parseInt(data.id_jugador);
    const id_capitan = parseInt(data.id_capitan);

    // Obtener la lista de equipos
    const equipos = await db.from('equipo').select('*');

    // Crear un array de promesas para obtener las solicitudes para cada equipo
    const solicitudesPromises = equipos.data.map(async equipo => {
        // Obtener la solicitud para el jugador y el equipo actual
        const solicitud = await db.from('invitaciones')
            .select('*')
            .eq('id_capitan', id_capitan)
            .eq('id_jugador_invitado', id_jugador)
            .eq('id_equipo', equipo.id_equipo).single()
            

        // Retornar la información del equipo y la solicitud
        return {
            ...equipo,
            cant_jugadores: equipo.id_jugadores.length,
            estado: estadoJugadorAEquipo(id_jugador, equipo, solicitud.data),
            solicitud: solicitudJugadorAEquipo(id_jugador, equipo, solicitud.data)
        };
    });

    // Esperar a que todas las promesas se resuelvan
    const equiposTransformados = await Promise.all(solicitudesPromises);
    const equiposCapitan = equiposTransformados.filter(equipo => equipo.capitan === parseInt(id_capitan))
    return res.json(equiposCapitan);
}

 function solicitudJugadorAEquipo(id_jugador, equipos, solicitud) {
    if(equipos.id_jugadores?.includes(id_jugador)) {
       return "No puedes solicitar unirte"     
    }

    if(!solicitud?.estado || solicitud?.estado.trim() === "" || solicitud === null) {
        return "No enviado"
    }

    if(solicitud.estado) {
        return solicitud.estado 
    }

}

function estadoJugadorAEquipo(id_jugador, equipos, solicitud) {
    if(equipos.id_jugadores?.includes(id_jugador)) {
        return "Ya perteneces a este equipo"
    }
    
    return !(!solicitud?.estado || solicitud?.estado.trim() === "") ? solicitud.estado : "No enviado";
}

module.exports = {
    buscarEquiposInvitar: buscarEquiposInvitar
};