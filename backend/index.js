const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Usamos body-parser para parsear el cuerpo de las solicitudes POST
app.use(bodyParser.json());

// Variable para almacenar los datos del robot
let robotData = { idRobot: null, estadoRobot: null };

// Ruta POST para recibir los datos del ESP32
app.post('/data', (req, res) => {
  console.log("Pruebas de conexion");

  // Extraer los datos del cuerpo de la solicitud
  const { idRobot, estadoRobot } = req.body;

  // Almacenar los datos del robot
  robotData = { idRobot, estadoRobot };

  // Imprimir el mensaje recibido en la consola
  console.log('Mensaje recibido desde el ESP32:', idRobot, estadoRobot);

  // Responder al ESP32 con un mensaje de confirmación
  res.send('Mensaje recibido con éxito en el servidor.');
});
app.get('/dataFrontend', (req, res) => {
  res.json(robotData);
})

// Ruta para servir la página web y mostrar los datos del robot
app.get('/', (req, res) => {
  // Crear una página HTML para mostrar los datos
  res.send(`
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Estado del Robot</title>
  <script>
    // Función para actualizar los datos en la página
    function updateData() {
      fetch('/dataFrontend')  // Solicita los datos del servidor
        .then(response => response.json())  // Convierte la respuesta a formato JSON
        .then(data => {
          // Actualiza los elementos en la página con los datos
          document.getElementById('idRobot').innerText = data.idRobot || 'No disponible';
          document.getElementById('estadoRobot').innerText = data.estadoRobot || 'No disponible';
        })
        .catch(error => console.error('Error al obtener datos:', error));
    }

    // Llama a la función updateData cada 5 segundos para actualizar los datos
    setInterval(updateData, 5000);
    
    // Llamada inicial para cargar los datos al cargar la página
    window.onload = updateData;
  </script>
</head>
<body>
  <h1>Datos del Robot</h1>
  <p><strong>ID del Robot:</strong> <span id="idRobot">Cargando...</span></p>
  <p><strong>Estado del Robot:</strong> <span id="estadoRobot">Cargando...</span></p>
  <br/>
  <p><strong>ID del Robot:</strong> <span id="idRobot">Cargando...</span></p>
  <p><strong>Estado del Robot:</strong> <span id="estadoRobot">Cargando...</span></p>
</body>
</html>
  `);
});

// Iniciar el servidor
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
