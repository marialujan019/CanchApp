async function update(req, res, db){
    const data = req.body

    console.log("UPDATE: " + data)
    await db.from('equipo').update({
        nombre_equipo: data.nombre_equipo,
        cant_jugador: data.cant_jugador,
        capitan: data.capitan,
        id_jugadores: data.id_jugadores,
        publico: data.publico
    }).eq('id_equipo', data.id_equipo)
}


module.exports = {
    update: update
};