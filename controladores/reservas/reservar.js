async function reservar(req, res, db){
    const data = req.body
    await db.from('reservas')
    .upsert([{
        id_agenda: data.id_agenda,
        id_equipo: data.id_equipo,
        estado: "Pendiente"
      }]);

    await db.from('agenda')
    .update({ disponibilidad: 'pendiente', id_equipo: data.id_equipo })
    .eq('id_agenda', data.id_agenda);

}


module.exports = {
    reservar: reservar
};