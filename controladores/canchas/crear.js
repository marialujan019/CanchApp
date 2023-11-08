async function crear(req, res, db) {
    const data = req.body;

    var techo = data.techo === 'si' ? true : false
    console.log(data)
    await db.from('cancha').upsert([{
        id_complejo: data.id_complejo,
        cant_jugador: data.cant_jugador,
        techo: techo,
        nombre_cancha: data.nombre_cancha,
        precio_turno: data.precio_turno
    }]);
}

module.exports = {
    crearCanchaEndpoint: crear
}