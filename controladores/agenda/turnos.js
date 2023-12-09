async function turnos(req, res, db){
    const turnos = await db.from('agenda').select('fecha, hora, disponibilidad, id_cancha').in('id_complejo', [req.params.id])
    
    const datosEntrada = turnos.data;
      
      // Organizar los datos por fecha, hora y disponibilidad
      const datosOrganizados = datosEntrada.reduce((acc, reserva) => {
        const claveFecha = reserva.fecha;
        const claveHora = reserva.hora.padStart(2, '0');
        const claveDisponibilidad = reserva.disponibilidad === 'Disponible' ? 'disponibles' : 'ocupadas';
      
        if (!acc[claveFecha]) {
          acc[claveFecha] = {
            fecha_seleccionada: claveFecha,
            horario_disponibilidad: {}
          };
        }
      
        if (!acc[claveFecha].horario_disponibilidad[claveHora]) {
          acc[claveFecha].horario_disponibilidad[claveHora] = {
            disponibles: [],
            ocupadas: []
          };
        }
      
        acc[claveFecha].horario_disponibilidad[claveHora][claveDisponibilidad].push(reserva.id_cancha);
      
        return acc;
      }, {});
      
      // Convertir el objeto organizado en un array
      const resultado = Object.values(datosOrganizados);
      
      console.log(resultado);
      
    return res.json(resultado);

}


module.exports = {
    turnos: turnos
};