async function soyCapitan(req, res, db){
    const equipos = await db.from('equipo').select('*').contains('id_jugadores', [req.params.id])
    const equiposTransformados = equipos.data.map(equipo => ({
        ...equipo,
        cant_jugadores: equipo.id_jugadores.length
      }));

    const equiposCapitan = equiposTransformados.filter(equipo => equipo.capitan === parseInt(req.params.id))

    return res.json(equiposCapitan);

}


module.exports = {
    soyCapitan: soyCapitan,
};