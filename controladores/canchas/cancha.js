async function cancha(req, res, db) {
    const {id} = req.body;

    const cancha = await db.from('cancha').select('*').eq('id_cancha', id).single();
    console.log(cancha.data.nombre_cancha)
    return res.json({ Status: 'Respuesta ok', 
                      nombre: cancha.data.nombre_cancha,
                      techo: cancha.data.techo,
                      jugadores: cancha.data.cant_jugador})

}

module.exports = {
    canchaEndpoint: cancha
}