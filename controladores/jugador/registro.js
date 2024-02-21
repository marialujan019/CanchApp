const http = require('http');

async function registroEndpoint(req, res, db, bcrypt) {
  
    const data = req.body;
    const {nombre, apellido, fecha_nac, telefono, mail, contrasena, posicion, pierna_habil, sexo, usuario} = data;

    if(isAValidBody(data, res)) {
      bcrypt.hash(data.contrasena, 5, async (err, hash) => {
        if (err) {
          console.error('Error al generar el hash de la contraseña:', err);
          return;
        }
      
        // Guardar el hash en una variable
        const hashedPassword = hash;
        data.contrasena = hashedPassword;
        const jugadorYaExiste = await jugadorExiste(data.mail, db);
        if (jugadorYaExiste) {
          res.status(400).send({ "message": "El jugador ya esta registrado"}); // O lanzar un error, dependiendo de tus necesidades
        } else {
          insertarJugadorYLogin(data, hash, db, res);
        }
          
        }
        
      );
  }
    
}

async function insertarJugadorYLogin(data, hash, db, res) {
  try {
    // Inserta datos en la tabla "jugador"
    const { jugadorData, jugadorError } = await db
      .from('jugador')
      .upsert([{
        nombre: data.nombre,
        apellido: data.apellido,
        fecha_nac: data.fecha_nac,
        telefono: data.telefono,
        mail: data.mail,
        contrasena: hash,
        posicion: data.posicion,
        pierna_habil: data.pierna_habil,
        sexo: data.sexo
      }]);

    // Inserta datos en la tabla "login"
    const { loginData, loginError } = await db
      .from('login')
      .upsert([
        {
          mail: data.mail,
          contrasena: hash,
          tipo: data.tipo
        }
      ]);

    if (jugadorError || loginError) {
      console.error('Error al insertar datos:', jugadorError || loginError);
    } else {
      res.status(200).send({ "message": "Created"});

    }
  } catch (err) {
    console.error('Error en la conexión:', err);
  }
}

function isAValidBody(data, res) {
  const {nombre, apellido, mail, contrasena, fecha_nac, telefono} = data;

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

  if(!isValidPass(contrasena)) {
    res.status(400).json({ "message": "no es una contrasena valida" });
  }

  if(!isValidPhone(telefono)) {
    res.status(400).json({ "message": "no es un telefono valido" });
  }

  return nombre && apellido && mail && contrasena && fecha_nac && telefono;
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

async function jugadorExiste(mail, db) {
  const result = await db
      .from('login')
      .select('mail')
      .eq('mail', mail);
  
  const jugadorExiste = result.data.length > 0;
  return jugadorExiste;
}
  
module.exports = {
  registroEndpoint: registroEndpoint
}
  
  
  