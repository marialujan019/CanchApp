async function deleteSolicitud(req, res, db){
    const data = req.body
    const id_jugador = req.params.id_jugador;
    const id_equipo = req.params.id_equipo;

    await db.from('solicitudes')
        .delete()
        .eq('id_jugador', id_jugador)
        .eq('id_equipo', id_equipo)
        .single();
}


module.exports = {
    deleteSolicitud: deleteSolicitud
};