async function crear(req, res, db) {
    try {
        const data = req.body;
        console.log("Invitaciones: " + data)
        const hasInvitationPending = await checkInvitation(data.id_jugador, data.id_equipo, db); //true
        const isPlayerInCurrentTeam = await checkPlayer(data.id_jugador, data.id_equipo, db); //false
        const hasSolitud = await checkPlayerSolicitud(data.id_jugador, data.id_equipo, db); //false
        
        if(!hasInvitationPending && !isPlayerInCurrentTeam && !hasSolitud) {
            console.log("crear solicitud: adentro")
            await db.from('invitaciones').upsert([
                {
                  id_jugador_invitado: parseInt(data.id_jugador),
                  id_equipo: parseInt(data.id_equipo),
                  id_capitan: parseInt(data.id_capitan),
                  estado: "Pendiente"
                },
              ]);
              res.status(200).send({ "message": "invitacion enviada"});
        } else {
            if(hasInvitationPending) {
                res.status(200).send({ "message": "Ya enviaste una invitación a este jugador"});
            }
            
            if(isPlayerInCurrentTeam) {
                res.status(200).send({ "message": "El jugador ya pertecene a este equipo."});
            }

            if(hasSolitud) {
                res.status(200).send({ "message": "El jugador envio una solucitud para unirse a tu equipo."});
            }
        }
      } catch (err) {
          console.error('Error en la conexión:', err);
      }
    
}

async function checkInvitation(id_jugador, id_equipo, db) {
    const data = await db.from('invitaciones').select('*').eq('id_jugador_invitado', id_jugador).eq('id_equipo', id_equipo);
    console.log("check invitation: " + JSON.stringify(data.data[0]?.estado));
    if(data.data == null || data.data === "" || data.data.length == 0){
        console.log("check invitation falseee")
        return false;
    }
    return true;
}

async function checkPlayer(id_jugador, id_equipo, db) {
    const data = await db.from('equipo').select('id_jugadores').eq('id_equipo', id_equipo);
    console.log("check player: " +  data);
    const jugadores = data.data[0].id_jugadores
    if(jugadores.includes(id_jugador)) {
        return true;
    }

    return false;
}

async function checkPlayerSolicitud(id_jugador, id_equipo, db) {
    const data = await db.from('solicitudes').select('estado').eq('id_jugador', id_jugador).eq('id_equipo', id_equipo);
    console.log("check si el jugador tiene una solicitud enviada: " +  data.data);

    if(data.data.length !== 0) {
        const estado = data.data[0].estado;
        return estado === "Pendiente" || estado === "Confirmado"
    }

    return false;
}

module.exports = {
    invitacionesEndpoint: crear,
};