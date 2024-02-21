async function canchas(req, res, db) {
    const canchas = await db.from('cancha').select('*').eq('id_complejo', req.params.id);
    
    return res.json({ Status: 'Respuesta ok', canchas: canchas.data })
}

module.exports = {
    complejoCanchas: canchas
}