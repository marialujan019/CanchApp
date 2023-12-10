async function jugadores(req, res, db){
    const jugadores = await db.from('jugador').select('nombre, apellido, fecha_nac, telefono, posicion, pierna_habil, sexo')
    const jugadoresConEdad = jugadores.data.map(jugador => ({
        ...jugador,
        edad: calcularEdad(jugador.fecha_nac)
      }));
    return res.json(jugadoresConEdad);    
    
}

function calcularEdad(fechaNacimiento) {
    const fechaActual = new Date();
    const fechaNac = new Date(fechaNacimiento);
  
    let edad = fechaActual.getFullYear() - fechaNac.getFullYear();
    const mesActual = fechaActual.getMonth() + 1;
    const mesNac = fechaNac.getMonth() + 1;
  
    if (mesActual < mesNac || (mesActual === mesNac && fechaActual.getDate() < fechaNac.getDate())) {
      edad--;
    }
  
    return edad;
  }

module.exports = {
    jugadores: jugadores
};