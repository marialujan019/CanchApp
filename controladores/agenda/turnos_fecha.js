async function turnosFecha(req, res, db){
    const turnos = await db.from('agenda').select('fecha, hora, disponibilidad, id_cancha, id_agenda').eq('id_complejo', req.params.id).in('fecha', [req.params.fecha])
    const datosEntrada = turnos.data;
    
    const datosOrganizados = datosEntrada.reduce((acc, reserva) => {
      const fecha = reserva.fecha;
      const hora = reserva.hora;
      const disponibilidad = reserva.disponibilidad === 'Disponible' ? 'disponibles' : 'ocupadas';
    
      if (!acc[fecha]) {
        acc[fecha] = {
          fecha_seleccionada: fecha,
          horario_disponibilidad: {}
        };
      }
    
      if (!acc[fecha].horario_disponibilidad[hora]) {
        acc[fecha].horario_disponibilidad[hora] = {
          disponibles: [],
          ocupadas: []
        };
      }
    
      const nuevaReserva = {
        id_cancha: reserva.id_cancha,
        id_agenda: reserva.id_agenda
      };
    
      acc[fecha].horario_disponibilidad[hora][disponibilidad].push(nuevaReserva);
    
      return acc;
    }, {});
    
    
    return res.json(Object.values(datosOrganizados)[0]);     
}


module.exports = {
    turnosFecha: turnosFecha
};