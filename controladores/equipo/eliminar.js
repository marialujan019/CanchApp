async function eliminarEquipo(req, res, db) {
    const id = req.params.id;
    await db.from('reservas').delete().eq('id_equipo', id);
    await db.from('solicitudes').delete().eq('id_equipo', id)
    await db.from('invitaciones').delete().eq('id_equipo', id)
    await db.from('equipo').delete().eq('id_equipo', id);
    return res.json({ Status: 'Respuesta ok'})
}

module.exports = {
    eliminarEquipo: eliminarEquipo
}