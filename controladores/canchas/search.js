async function search(req, res, db) {
    const {id_admin} = req.body;

    const id_complejo = await db.from('complejo').select('id_complejo').eq('id_admin', id_admin).single();
    const canchas = await db.from('cancha').select('*').eq('id_complejo', id_complejo.data.id_complejo);
    return res.json({ Status: 'Respuesta ok', canchas: canchas.data, id_complejo: id_complejo.data.id_complejo})

}

module.exports = {
    canchasEndpoint: search
}