import "dotenv/config";
import { buildApp } from "./app.js";

const app = buildApp();

const port = Number(process.env.PORT ?? 3000);

app
  .listen({ port, host: "0.0.0.0" })
  .then((address) => {
    app.log.info(`Servidor rodando em ${address}`);
    app.log.info(`Documentacao disponivel em ${address}/docs`);
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
