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
import { AutenticarComOtp } from './routes/auth/autenticar-com-otp'
import { CriarContaUsuario } from './routes/auth/criar-conta'
import { CriarContaUsuarioCliente } from './routes/auth/criar-conta-cliente'
import { requisitaAutenticacaoComOTP } from './routes/auth/requisita-autenticacao-otp'
import { RequisitarRecuperacaoSenha } from './routes/auth/requisitar-recuperacao-senha'
import { ResetarSenha } from './routes/auth/resetar-senha'
import { AtualizarOrganizacao } from './routes/orgs/atualizar-organizacao'
import { CriarOrganizacao } from './routes/orgs/criar-organizacao'
import { AtualizarServico } from './routes/servico/atualizar-servico'
import { BuscarServico } from './routes/servico/buscar-servico'
import { BuscarServicos } from './routes/servico/buscar-servicos'
import { CriarServico } from './routes/servico/criar-servico'

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
app.register(AutenticarComOtp)
app.register(CriarContaUsuario)
app.register(CriarContaUsuarioCliente)
app.register(RequisitarRecuperacaoSenha)
app.register(ResetarSenha)

app.register(CriarOrganizacao)
app.register(AtualizarOrganizacao)

app.register(CriarServico)
app.register(AtualizarServico)
app.register(BuscarServico)
app.register(BuscarServicos)

app.listen({ port: env.SERVER_PORT }).then(() => {
  console.log(`HTTP Server running on http://localhost:${env.SERVER_PORT}/docs`)
})
