const http = require('http');

async function complejoEndpoint(req, res, bcrypt, db) {
    const data = req.body;
    var complejo = data.complejo
    var administrador = data.administrador
    const mail = administrador.mail

    if(isAValidComplejo(complejo, res) && isValidAdmin(administrador, res)){
        bcrypt.hash(administrador.contrasena, 5, async (err, hash) => {
            if (err) {
              console.error('Error al generar el hash de la contraseña:', err);
              return;
            }
            // Guardar el hash en una variable
            const hashedPassword = hash;
            administrador.contrasena = hashedPassword;
            const complejoYaExiste = await complejoExiste(administrador.mail, db);
            if (complejoYaExiste) {
              console.log('El complejo ya está registrado en la base de datos.');
              res.status(400).send({ "message": "El complejo ya esta registrado"}); // O lanzar un error, dependiendo de tus necesidades
            } else {
              try {

                const {admin, errorAdmin} = await db
                .from('administrador')
                .upsert([{
                  nombre: administrador.nombre,
                  apellido: administrador.apellido,
                  telefono: administrador.telefono,
                  mail: administrador.mail,
                  contrasena: hash
                }]);

                const {login, error} = await db
                  .from('login')
                  .upsert([
                    {
                      mail: administrador.mail,
                      contrasena: hash,
                      tipo: "administrador"
                    }
                  ]);
                
                  console.log(administrador.mail)

                const {data, errorAdmin2} = await db.from('administrador').select('*').eq('mail', administrador.mail).single();

                console.log(data)

                const {complejoData, errorComplejo} = await db.from("complejo").upsert([{
                  nombre_complejo: complejo.nombreComplejo,
                  telefono: complejo.telefonoComplejo,
                  direccion: complejo.direccion,
                  cant_canchas: null,
                  ciudad: complejo.ciudad,
                  cuit: complejo.cuit,
                  id_admin: data.id_admin,
                  longitud: complejo.longitud,
                  latitud: complejo.latitud
                }]);

                res.status(200).json({ "message": "Created", "data": data });
            } catch (error) {
              console.log(error)
                res.status(500).send({ message: http.STATUS_CODES[500] });
            }}
              
            }
            
          );
    }
}

function isAValidComplejo(complejo, res) {
  const {nombreComplejo, cuit, ciudad, direccion, telefonoComplejo} = complejo

  if (!complejo) {
    res.status(400).json({ "message": http.STATUS_CODES[400] });
    return;
  }

  if(!isValidString(nombreComplejo)) {
    res.status(400).json({ "message": "no es un nombre valido" });
  }

  if(!isValidPhone(cuit)) {
    res.status(400).json({ "message": "no es una razon social valida" });
  }

  if(!isValidString(ciudad)) {
    res.status(400).json({ "message": "no es un nombre valido" });
  }

  if(!isValidDirection(direccion)){
    res.status(400).json({ "message": "no es una direccion valida" });
  }

  if(!isValidPhone(telefonoComplejo)) {
    res.status(400).json({ "message": "no es un telefono valido" });
  }

  return nombreComplejo && cuit && ciudad && direccion && telefonoComplejo;
}

function isValidAdmin(administrador, res) {
  const {nombre, apellido, mail, contrasena, telefono} = administrador

  if (!administrador) {
    res.status(400).json({ "message": http.STATUS_CODES[400] });
    return;
  }

  if(!isValidString(nombre)) {
    res.status(400).json({ "message": "no es un nombre valido" });
  }

  if(!isValidString(apellido)) {
    res.status(400).json({ "message": "no es un apellido valido" });
  }

  if(!isAValidMail(mail)) {
    res.status(400).json({ "message": "no es un mail valido" });
  }

  if(!isValidPass(contrasena)) {
    res.status(400).json({ "message": "no es una contrasena valida" });
  }

  if(!isValidPhone(telefono)) {
    res.status(400).json({ "message": "no es un telefono valido" });
  }

  return nombre && apellido && mail && contrasena && telefono;
}

function isValidString(str) {
  // Verificar si el string es una cadena válida y no está vacío
  if (typeof str !== 'string' || str.length === 0) {
    return false;
  }

  // Expresión regular para verificar si el string contiene solo letras y números
  const regex = /^[a-zA-Z ]+$/;

  // Verificar si el string cumple con los criterios de la expresión regular
  if (!regex.test(str)) {
    return false;
  }

  // Verificar si la longitud del string está dentro del rango permitido (entre 3 y 20 caracteres)
  if (str.length < 3 || str.length > 20) {
    return false;
  }

  // Si todas las condiciones se cumplen, el string es válido
  return true;
}

function isAValidMail(mail) {
  // Expresión regular para validar una dirección de correo electrónico
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Verificar si el email cumple con los criterios de la expresión regular
  return regex.test(mail);
}

function isValidPass(contrasena) {
  // Expresión regular para verificar si la contraseña contiene al menos una letra mayúscula
  const regexMayuscula = /[A-Z]/;

  const regexMin = /[a-z]/;

  // Expresión regular para verificar si la contraseña contiene al menos un número
  const regexNumero = /[0-9]/;

  // Verificar la longitud de la contraseña (mínimo 8, máximo 20 caracteres)
  if (contrasena.length < 8 || contrasena.length > 20) {
    return false;
  }

  // Verificar si la contraseña contiene al menos una letra mayúscula
  if (!regexMayuscula.test(contrasena)) {
    return false;
  }

  if (!regexMin.test(contrasena)) {
    return false;
  }

  // Verificar si la contraseña contiene al menos un número
  if (!regexNumero.test(contrasena)) {
    return false;
  }

  // Si todas las condiciones se cumplen, la contraseña es válida
  return true;
}

function isValidPhone(telefono){
  const regexNumero = /[0-9]/;

  return regexNumero.test(telefono);
}

function isValidDirection(str){
    if (typeof str !== 'string' || str.length === 0) {
        return false;
    }
    
    // Expresión regular para verificar si el string contiene solo letras y números
    const regex = /^[a-zA-Z0-9 ]+$/;
    
    // Verificar si el string cumple con los criterios de la expresión regular
    if (!regex.test(str)) {
      return false;
    }
    
    // Verificar si la longitud del string está dentro del rango permitido (entre 3 y 20 caracteres)
    if (str.length < 2 || str.length > 50) {
      return false;
    }
    
    // Si todas las condiciones se cumplen, el string es válido
    return true;
}

async function complejoExiste(mail, db) {
  const result = await db
  .from('login')
  .select('mail')
  .eq('mail', mail);

  const jugadorExiste = result.data.length > 0;
  return jugadorExiste;
}

module.exports = {
    complejoEndpoint: complejoEndpoint
}