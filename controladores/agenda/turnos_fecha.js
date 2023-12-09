async function turnosFecha(req, res, db){
    const turnos = await db.from('agenda').select('fecha, hora, disponibilidad, id_cancha').eq('id_complejo', req.params.id).in('fecha', [req.params.fecha])
    const datosEntrada = turnos.data;
      
      // Organizar los datos por hora y disponibilidad
      const datosOrganizados = datosEntrada.reduce((acc, reserva) => {
        const claveHora = reserva.hora.padStart(2, '0');
        const claveDisponibilidad = reserva.disponibilidad === 'Disponible' ? 'disponibles' : 'ocupadas';
      
        if (!acc[claveHora]) {
          acc[claveHora] = { disponibles: [], ocupadas: [] };
        }
      
        acc[claveHora][claveDisponibilidad].push(reserva.id_cancha);
        return acc;
      }, {});
      
      // Construir el objeto de salida
      const resultado = {
        fecha_seleccionada: datosEntrada[0]?.fecha,
        horario_disponibilidad: datosOrganizados
      };
      
      console.log("datos de entrada " + datosEntrada[0])
      console.log(resultado);
    return res.json(resultado);     
}


module.exports = {
    turnosFecha: turnosFecha
};