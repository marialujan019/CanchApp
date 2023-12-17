async function perfilUpdate(req, res, db){
    const data = req.body
    const id = req.params.id

    await db.from('jugador').update({
        nombre: data.nombre, 
        apellido: data.apellido, 
        telefono: data.telefono,
        pierna_habil: data.pierna_habil, 
        posicion: data.posicion, 
        mail: data.mail, 
        sexo: data.sexo})
    .eq('id_jug', id)

    await db.from('login').update({mail: data.mail}).eq('mail', data.mailViejo);
}


module.exports = {
    perfilUpdate: perfilUpdate
};