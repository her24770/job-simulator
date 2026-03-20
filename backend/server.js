require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.APP_PORT || 8080;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});