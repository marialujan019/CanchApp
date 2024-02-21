async function deleteInvitaciones(req, res, db){
    const data = req.body
    const id_jugador = req.params.id_jugador;
    const id_equipo = req.params.id_equipo;

    await db.from('invitaciones')
        .delete()
        .eq('id_jugador_invitado', id_jugador)
        .eq('id_equipo', id_equipo)
        .single();
}


module.exports = {
    deleteInvitaciones: deleteInvitaciones
};