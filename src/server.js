import 'dotenv/config';
import app from './app.js';

const BASE_URL = process.env.BASE_URL;
const PORT = process.env.PORT || new URL(BASE_URL).port;

app.listen(PORT, () => {
  console.log(`Servidor rodando em ${BASE_URL}`);
  console.log(`Documentação Swagger disponível em ${BASE_URL}/api-docs`);
});
