async function search(req, res, db) {
    const complejo = await db.from('complejo').select('*').eq('id_complejo', req.params.id).single();
    console.log(req.params)
    
    return res.json({ Status: 'Respuesta ok', complejo: complejo.data })
}

module.exports = {
    complejo: search
}