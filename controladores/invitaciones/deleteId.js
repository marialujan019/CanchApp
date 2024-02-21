async function deleteIdInvitaciones(req, res, db){
    const data = req.body
    console.log('params' + req.params)
    const id_invitacion = req.params.id_invitaciones;
    
    await db.from('invitaciones')
        .delete()
        .eq('id_invitacion', id_invitacion)
        .single();
}

module.exports = {
    deleteIdInvitaciones: deleteIdInvitaciones
};