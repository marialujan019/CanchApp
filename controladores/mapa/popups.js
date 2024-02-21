async function popups(req, res, db){
    const complejos = await db.from('complejo').select('id_complejo, nombre_complejo, direccion, telefono, latitud, longitud')
        
    return res.json(complejos.data);

}


module.exports = {
    popups: popups
};