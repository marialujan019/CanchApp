async function perfilEndpoint(req, res, db, bcrypt) {
    const data = req.body;

    if(data.tipo === "administrador") {
        const data2 = await db.from('complejo').select('*').eq('id_admin', data.id).single();

        const admin = await db.from('administrador').select('*').eq('id_admin', data.id).single();
        return res.json({ Status: 'Respuesta ok', nombre: data2.data.nombre_complejo, direccion: data2.data.direccion, telefono: data2.data.telefono, contrasena: admin.data.contrasena})
    }

    if(data.tipo === "jugador") {
      const data2 = await db.from('jugador').select('*').eq('id_jug', data.id).single();
      return res.json({ Status: 'Respuesta ok', nombre: data2.data.nombre, apellido: data2.data.apellido, telefono: data2.data.telefono, pierna_habil: data2.data.pierna_habil, posicion: data2.data.posicion, mail: data2.data.mail, sexo: data2.data.sexo})
    }
}

  module.exports = {
    perfilEndpoint: perfilEndpoint
  }