import Fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { userRoutes } from "./routes/users.js";
import { clientRoutes } from "./routes/clients.js";

export function buildApp() {
  const app = Fastify({
    logger: true,
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(swagger, {
    openapi: {
      info: {
        title: "API de Cadastro",
        description: "API simples de cadastro de usuários e clientes",
        version: "1.0.0",
      },
      tags: [
        { name: "Usuários", description: "Cadastro de usuários" },
        { name: "Clientes", description: "Cadastro de clientes" },
      ],
    },
    transform: jsonSchemaTransform,
  });

  app.register(swaggerUi, {
    routePrefix: "/docs",
  });

  app.get("/health", async () => ({ status: "ok" }));

  app.register(userRoutes);
  app.register(clientRoutes);

  return app;
}
