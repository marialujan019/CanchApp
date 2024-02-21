async function cancha(req, res, db) {
    const {id} = req.body;

    const cancha = await db.from('cancha').select('*').eq('id_cancha', id).single();
    return res.json({ Status: 'Respuesta ok', 
                      nombre: cancha.data.nombre_cancha,
                      techo: cancha.data.techo,
                      jugadores: cancha.data.cant_jugador,
                      precio_turno: cancha.data.precio_turno})

}

module.exports = {
    canchaEndpoint: cancha
}