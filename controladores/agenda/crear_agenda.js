async function crearAgenda(req, res, db) {
    const diaInicio = req.body.diaInicio;
    const diaFin = req.body.diaFin;
    const horaInicio = req.body.horaInicio;
    const horaFin = req.body.horaFin;
    const idCancha = req.body.idCancha;
    const idComplejo = req.body.idComplejo; 

    const diaInicioSplit = diaInicio.split("-")
    const diaFinSplit = diaFin.split("-")
    const diaInicioSplitMes = parseInt(diaInicioSplit[1]) - 1;
    const diaFinSplitMes = parseInt(diaFinSplit[1]) - 1;


    let currentDate = new Date(diaInicioSplit[0], diaInicioSplitMes, diaInicioSplit[2]);
    let ultimatDate = new Date(diaFinSplit[0], diaFinSplitMes, diaFinSplit[2]);

    const horaInicioSplit = horaInicio.split(':')
    const horaFinSplit = horaFin.split(':')
    let horaInicio1 = horaInicioSplit[0];


    while (currentDate <= ultimatDate) {
       
        let horaFin = horaFinSplit[0] == "00" ? 24 : horaFinSplit[0];
        
        while (horaInicio1 <= horaFin) {
            await db.from('agenda').upsert([{
                id_cancha: idCancha,
                id_complejo: idComplejo,
                fecha: currentDate,
                hora: horaInicio1,
                disponibilidad: 'Disponible'
            }]);
            horaInicio1 = parseInt(horaInicio1) +1;
        }
        horaInicio1 = horaInicioSplit[0];
        currentDate.setDate(new Date(currentDate.getDate() + 1));
    }
    
    res.status(200).json({Status: 'Respuesta ok' });

}

module.exports = {
    crearAgendaEndpoint: crearAgenda
}