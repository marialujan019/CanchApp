async function misEquipos(req, res, db){
    const equipos = await db.from('equipo').select('*').contains('id_jugadores', [req.params.id])
    const equiposTransformados = equipos.data.map(equipo => ({
        ...equipo,
        cant_jugadores: equipo.id_jugadores.length
      }));

    return res.json(equiposTransformados);

}


module.exports = {
    misEquipos: misEquipos,
};