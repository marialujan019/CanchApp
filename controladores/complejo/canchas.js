async function canchas(req, res, db) {
    console.log(req.params.id)
    const canchas = await db.from('cancha').select('*').eq('id_complejo', req.params.id);
    console.log(req.params)
    
    return res.json({ Status: 'Respuesta ok', canchas: canchas.data })
}

module.exports = {
    complejoCanchas: canchas
}