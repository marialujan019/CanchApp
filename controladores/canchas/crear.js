async function crear(req, res, db) {
    try {
      const data = req.body;
      const techo = data.techo === 'si' ? true : false;
  
       await db.from('cancha').upsert([
        {
          id_complejo: data.id_complejo,
          cant_jugador: data.cant_jugador,
          techo: techo,
          nombre_cancha: data.nombre_cancha,
          precio_turno: data.precio_turno,
        },
      ]);
      // Consulta adicional para obtener el ID de la cancha
        const { data: cancha } = await db
        .from('cancha')
        .select('id_cancha')
        .eq('id_complejo', data.id_complejo)
        .eq('nombre_cancha', data.nombre_cancha)
        .single();

const idCancha = cancha?.id_cancha ?? null;
      // Supabase devuelve el ID de la cancha en el objeto cancha
      res.status(200).json({Status: 'Respuesta ok', idCancha: idCancha });
    } catch (error) {
      console.error('Error al crear la cancha:', error);
      res.status(500).send('Error interno del servidor');
    }
  }
  
  module.exports = {
    crearCanchaEndpoint: crear,
  };
  