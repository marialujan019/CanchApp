const http = require('http');

async function registroEndpoint(req, res, db, bcrypt) {
  
    const data = req.body;
    const {nombre, apellido, mail, pass, fnac, telefono, sexo, tipo} = data;
    console.log(data)

    if(isAValidBody(data, res)) {
      bcrypt.hash(data.pass, 5, async (err, hash) => {
        if (err) {
          console.error('Error al generar el hash de la contraseña:', err);
          return;
        }
      
        // Guardar el hash en una variable
        const hashedPassword = hash;
        data.pass = hashedPassword;
        const jugadorYaExiste = await jugadorExiste(data.mail, db);
        if (jugadorYaExiste) {
          console.log('El jugador ya está registrado en la base de datos.');
          res.status(400).send({ "message": "El jugador ya esta registrado"}); // O lanzar un error, dependiendo de tus necesidades
        } else {
          try {
          await db("jugador").insert(data);
          await db("loginJugador").insert({
            mail: mail,
            pass: hash,
            tipo: "jugador"
          });
          console.log("Jugador registrado");
          res.status(200).json({ "message": "Created", "data": data });
        } catch (error) {
          res.status(500).send({ message: http.STATUS_CODES[500] });
        }}
          
        }
        
      );
  }
    
}

function isAValidBody(data, res) {
  const {nombre, apellido, mail, pass, fnac, telefono} = data;

  if (!data) {
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

  if(!isValidPass(pass)) {
    res.status(400).json({ "message": "no es una contrasena valida" });
  }

  if(!isValidPhone(telefono)) {
    res.status(400).json({ "message": "no es un telefono valido" });
  }

  return nombre && apellido && mail && pass && fnac && telefono;
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

function isValidPass(pass) {
  // Expresión regular para verificar si la contraseña contiene al menos una letra mayúscula
  const regexMayuscula = /[A-Z]/;

  const regexMin = /[a-z]/;

  // Expresión regular para verificar si la contraseña contiene al menos un número
  const regexNumero = /[0-9]/;

  // Verificar la longitud de la contraseña (mínimo 8, máximo 20 caracteres)
  if (pass.length < 8 || pass.length > 20) {
    return false;
  }

  // Verificar si la contraseña contiene al menos una letra mayúscula
  if (!regexMayuscula.test(pass)) {
    return false;
  }

  if (!regexMin.test(pass)) {
    return false;
  }

  // Verificar si la contraseña contiene al menos un número
  if (!regexNumero.test(pass)) {
    return false;
  }

  // Si todas las condiciones se cumplen, la contraseña es válida
  return true;
}

function isValidPhone(telefono){
  const regexNumero = /[0-9]/;

  return regexNumero.test(telefono);
}

async function jugadorExiste(mail, db) {
  console.log('jugadorExiste')
  const result = await db.select('mail').from('loginJugador').where('mail','=', mail);
  const jugadorExiste = result.length > 0;
  return jugadorExiste;
}
  
module.exports = {
  registroEndpoint: registroEndpoint
}
  
  
  