async function crear(req, res, db) {
    try {
        const data = req.body;
        const hasInvitationPending = await checkInvitation(data.id_jugador, data.id_equipo, db);
        const isPlayerInCurrentTeam = await checkPlayer(data.id_jugador, data.id_equipo, db);
        const hasSolitud = await checkPlayerSolicitud(data.id_jugador, data.id_equipo, db);
        
        if(!hasInvitationPending && !isPlayerInCurrentTeam && !hasSolitud) {
            await db.from('solicitudes').upsert([
                {
                  id_jugador: data.id_jugador,
                  id_equipo: data.id_equipo
                },
              ]);
              res.status(200).send({ "message": "solicitud enviada"});
        } else {
            if(hasInvitationPending) {
                res.status(200).send({ "message": "El jugador tiene una invitación pendiente de este equipo."});
            }
            
            if(isPlayerInCurrentTeam) {
                res.status(200).send({ "message": "El jugador ya pertecene a este equipo."});
            }

            if(hasSolitud) {
                res.status(200).send({ "message": "El jugador ya envio solucitud para unirse a este equipo."});
            }
        }
      } catch (err) {
          console.error('Error en la conexión:', err);
      }
    
}

async function checkInvitation(id_jugador, id_equipo, db) {
    const data = await db.from('invitaciones').select('*').eq('id_jugador_invitado', id_jugador).eq('id_equipo', id_equipo).single();
    console.log("check invitation: " + data.data);
//a chequear
    if(data.data == null || data.data === "" || data.data.length == 0){
        return false;
    }
    return true;
}

async function checkPlayer(id_jugador, id_equipo, db) {
    const data = await db.from('equipo').select('id_jugadores').eq('id_equipo', id_equipo);
    console.log("check player: " +  data.data);
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
    solicitudesEndpoint: crear,
};