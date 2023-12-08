async function misEquipos(req, res, db){
    const equipos = await db.from('equipo').select('id_equipo, nombre_equipo').contains('id_jugadores', [req.params.id])
        
    console.log(equipos.data);
    return res.json(equipos.data);

}


module.exports = {
    misEquipos: misEquipos,
};