const { json } = require("body-parser");

async function historial(req, res, db){
    /*
    {
        "id_reserva": 1,
        "nombre_complejo": "Complejo Deportivo A",
        "nombre_cancha": "Cancha 1",
        "fechaYHora": "2023-12-01 14:30:00",
        "nombre_equipo": "Equipo A"
      }*/
      
    const equipos = await db.from('equipo').select('nombre_equipo, id_equipo').contains('id_jugadores', [req.params.id])
    const id_equipos = equipos.data.map(objeto => objeto.id_equipo);

    console.log(equipos.data)
    const reservas = await db.from('reservas').select('id, id_agenda, id_equipo, estado').in('id_equipo', [id_equipos])
    const idAgendas = reservas.data
    .filter(reserva => reserva.estado === "confirmado")
    .map(reserva => reserva.id_agenda);

        
    console.log(reservas.data)
    const agenda = await db.from('agenda').select('fecha, hora, id_complejo, id_cancha, id_equipo').in('id_agenda', idAgendas)
    
    const agendaData = agenda.data
        // Obtén los IDs únicos de complejo y cancha de tu arreglo
    const idComplejos = Array.from(new Set(agendaData.map(reserva => reserva.id_complejo)));
    const idCanchas = Array.from(new Set(agendaData.map(reserva => reserva.id_cancha)));

    // Realiza la consulta para obtener información de complejo y cancha
    Promise.all([
    db.from('complejo').select('id_complejo, nombre_complejo').in('id_complejo', idComplejos),
    db.from('cancha').select('id_cancha, nombre_cancha').in('id_cancha', idCanchas),
    db.from('equipo').select('nombre_equipo, id_equipo').contains('id_jugadores', [req.params.id])
    ])
    .then(([complejoData, canchaData, equipoData]) => {
        // Crea un mapa para buscar fácilmente la información por ID
        const complejoMap = new Map(complejoData.data.map(complejo => [complejo.id_complejo, complejo.nombre_complejo]));
        const canchaMap = new Map(canchaData.data.map(cancha => [cancha.id_cancha, cancha.nombre_cancha]));
        const equipoMap = new Map(equipoData.data.map(equipo => [equipo.id_equipo, equipo.nombre_equipo]));

        // Combina la información de complejo y cancha en el arreglo de reservas
        const reservasConNombres = agendaData.map(reserva => ({
        fechaYhora: reserva.fecha + " " + reserva.hora,
        nombre_complejo: complejoMap.get(reserva.id_complejo),
        nombre_cancha: canchaMap.get(reserva.id_cancha),
        nombre_equipo: equipoMap.get(reserva.id_equipo)
        }));

        return res.json(reservasConNombres);
    })
    .catch(error => console.error(error));



    console.log(agenda.data)

}

module.exports = {
    historial: historial
};