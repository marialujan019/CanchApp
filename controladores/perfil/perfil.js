async function perfilEndpoint(req, res, db, bcrypt) {
    const data = req.body;

    if(data.tipo === "administrador") {
        const data2 = await db.from('complejo').select('*').eq('id_admin', data.id).single();
        console.log(data2)

        const admin = await db.from('administrador').select('*').eq('id_admin', data.id).single();
        console.log(admin)
        return res.json({ Status: 'Respuesta ok', nombre: data2.data.nombre_complejo, direccion: data2.data.direccion, telefono: data2.data.telefono, contrasena: admin.data.contrasena})
    }

    if(data.tipo === "jugador") {
      const data2 = await db.from('jugador').select('*').eq('id_jug', data.id).single();
     
      return res.json({ Status: 'Respuesta ok', nombre: data2.data.nombre, telefono: data2.data.telefono, pierna_habil: data2.data.pierna_habil, posicion: data2.data.posicion})
    }
}

  module.exports = {
    perfilEndpoint: perfilEndpoint
  }