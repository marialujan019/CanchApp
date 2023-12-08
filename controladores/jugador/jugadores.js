async function jugadores(req, res, db){
    const jugadores = await db.from('jugador').select('nombre, apellido, fecha_nac, telefono, posicion, pierna_habil, sexo')
        
    console.log(jugadores.data);
    return res.json(jugadores.data);

}


module.exports = {
    jugadores: jugadores
};