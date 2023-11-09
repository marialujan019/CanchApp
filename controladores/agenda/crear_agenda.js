async function crearAgenda(req, res, db) {
    const data = req.body;
    console.log(data)
    await db.from('agenda').upsert([{
        id_cancha: data.id_cancha,
        fecha: data.fecha,
        hora: data.hora,
        disponibilidad: 'Disponible',
        id_jug: data.id_jug
    }]);

    res.status(200).json({Status: 'Respuesta ok' });

}

module.exports = {
    crearAgendaEndpoint: crearAgenda
}