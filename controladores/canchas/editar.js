async function update(req, res, db) {
    const id = req.params.id;
    const updatedData = req.body;

    const data = await db
      .from('cancha')
      .update(updatedData)
      .eq('id_cancha', id);
    
      return res.json({ Status: 'Respuesta ok'})

}

module.exports = {
    updateCanchaEndpoint: update
}