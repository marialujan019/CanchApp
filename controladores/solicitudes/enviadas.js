async function solicitudEnviada(req, res, db) {
    const id_jugador = req.params.id;

    const misSolicitudes = await db.from('solicitudes')
        .select('*')
        .eq('id_jugador', id_jugador)

    const equipos = await db.from('equipo').select('id_equipo, nombre_equipo').contains('id_jugadores', [req.params.id])
    const equipoData = equipos.data

    const data = misSolicitudes.data
    const responseEquipo = data.map(dato => {
        const equipo = equipoData.find(nombre => nombre.id_equipo === dato.id_equipo);
        return {
            ...dato,
            nombre_equipo: equipo ? equipo.nombre_equipo : 'Equipo no encontrado',
        };
    });

    const filterEstado = responseEquipo.filter(item => item.estado == "Pendiente")

    return res.json(filterEstado)
}

module.exports = {
    solicitudEnviada: solicitudEnviada
};
