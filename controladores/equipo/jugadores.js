async function jugadores(req, res, db){
    console.log(req.params.id)
    const jugadores = await db.from('equipo').select('id_jugadores').eq('id_equipo', req.params.id)
    const jugadoresList = jugadores.data.map(objeto => objeto.id_jugadores);    
    const jugadoresDatos = await db.from('jugador').select('nombre, apellido, fecha_nac, telefono, posicion, pierna_habil, sexo').in('id_jug', [jugadoresList])
    return res.json(jugadoresDatos.data);

}


module.exports = {
    jugadoresEquipo: jugadores
};