import { env } from '@agendamento-saas/env'
import fastifyCors from '@fastify/cors'
import { fastifyJwt } from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorHandler } from './error-handler'
import { autenticarComEmailSenha } from './routes/auth/autenticar-com-email-senha'
import { requisitaAutenticacaoComOTP } from './routes/auth/requisita-autenticacao-otp'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)
app.setErrorHandler(errorHandler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Next.js Agendador SaaS',
      description: 'Agendador Full-stack SaaS app with multi-tenant & RABC.',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(fastifyCors)

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(autenticarComEmailSenha)
app.register(requisitaAutenticacaoComOTP)

app.listen({ port: env.SERVER_PORT }).then(() => {
  console.log(`HTTP Server running on http://localhost:${env.SERVER_PORT}/docs`)
})
