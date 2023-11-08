async function deleteCancha(req, res, db) {
    const id = req.params.id;
    const cancha = await db.from('cancha').delete().eq('id_cancha', id);
    return res.json({ Status: 'Respuesta ok'})
}

module.exports = {
    deleteCanchaEndpoint: deleteCancha
}