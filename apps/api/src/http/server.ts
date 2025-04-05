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
import { AtualizarAgendamento } from './routes/agendamento/atualizar-agendamento'
import { BuscarAgendamento } from './routes/agendamento/buscar-agendamento'
import { BuscarAgendamentos } from './routes/agendamento/buscar-agendamentos'
import { CancelarAgendamento } from './routes/agendamento/cancelar-agendamento'
import { ConcluirAgendamento } from './routes/agendamento/concluir-agendamento'
import { ConfirmarAgendamento } from './routes/agendamento/confirmar-agendamento'
import { CriarAgendamento } from './routes/agendamento/criar-agendamento'
import { ReabrirAgendamento } from './routes/agendamento/reabrir-agendamento'
import { TransferirAgendamento } from './routes/agendamento/transferir-agendamento'
import { AtualizarAssinatura } from './routes/assinatura/atualiza-assinatura'
import { BuscarAssinante } from './routes/assinatura/buscar-assinante'
import { BuscarAssinaturaUsuarioPorIdUsuario } from './routes/assinatura/buscar-assinatura-por-id-usuario'
import { autenticarComEmailSenha } from './routes/auth/autenticar-com-email-senha'
import { AutenticarComOtp } from './routes/auth/autenticar-com-otp'
import { BuscarPerfil } from './routes/auth/buscar-perfil'
import { CriarContaUsuario } from './routes/auth/criar-conta'
import { CriarContaUsuarioCliente } from './routes/auth/criar-conta-cliente'
import { requisitaAutenticacaoComOTP } from './routes/auth/requisita-autenticacao-otp'
import { RequisitarRecuperacaoSenha } from './routes/auth/requisitar-recuperacao-senha'
import { ResetarSenha } from './routes/auth/resetar-senha'
import { AtualizarExpediente } from './routes/expediente/atualizar-expediente'
import { BuscarExpediente } from './routes/expediente/buscar-expediente'
import { BuscarExpedientes } from './routes/expediente/buscar-expedientes'
import { BuscarHorariosDisponiveis } from './routes/expediente/buscar-horarios-disponiveis'
import { CriarExpediente } from './routes/expediente/criar-expediente'
import { DeletarExpediente } from './routes/expediente/deletar-expediente'
import { MarcarExpedientePrincipal } from './routes/expediente/marcar-expediente-principal'
import { AtualizarAfiliacao } from './routes/membro/atualizar-afiliacao'
import { BuscarAfiliacao } from './routes/membro/buscar-afiliacao'
import { CriarAfiliacao } from './routes/membro/criar-afiliacao'
import { AtualizarOrganizacao } from './routes/orgs/atualizar-organizacao'
import { BuscarMembros } from './routes/orgs/buscar-membros'
import { BuscarMinhasOrganizacoes } from './routes/orgs/buscar-minhas-organizacoes'
import { BuscarOrganizacao } from './routes/orgs/buscar-organizacao'
import { BuscarOrganizacoes } from './routes/orgs/buscar-organizacoes'
import { CriarOrganizacao } from './routes/orgs/criar-organizacao'
import { BuscarProfissionais } from './routes/profissional/buscar-profissionais'
import { BuscarProfissional } from './routes/profissional/buscar-profissional'
import { AtualizarServico } from './routes/servico/atualizar-servico'
import { BuscarServico } from './routes/servico/buscar-servico'
import { BuscarServicos } from './routes/servico/buscar-servicos'
import { CriarServico } from './routes/servico/criar-servico'
import { AtualizarPerfil } from './routes/usuario/atualizar-perfil'

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

app.register(BuscarPerfil)
app.register(AtualizarPerfil)

app.register(CriarOrganizacao)
app.register(AtualizarOrganizacao)
app.register(BuscarOrganizacao)
app.register(BuscarOrganizacoes)
app.register(BuscarMinhasOrganizacoes)
app.register(BuscarMembros)

app.register(CriarServico)
app.register(AtualizarServico)
app.register(BuscarServico)
app.register(BuscarServicos)

app.register(CriarAfiliacao)
app.register(AtualizarAfiliacao)
app.register(BuscarAfiliacao)

app.register(CriarAgendamento)
app.register(BuscarAgendamento)
app.register(BuscarAgendamentos)
app.register(AtualizarAgendamento)
app.register(CancelarAgendamento)
app.register(TransferirAgendamento)
app.register(ConcluirAgendamento)
app.register(ReabrirAgendamento)
app.register(ConfirmarAgendamento)

app.register(CriarExpediente)
app.register(AtualizarExpediente)
app.register(DeletarExpediente)
app.register(MarcarExpedientePrincipal)
app.register(BuscarExpediente)
app.register(BuscarExpedientes)

app.register(BuscarProfissionais)
app.register(BuscarProfissional)
app.register(BuscarHorariosDisponiveis)

app.register(BuscarAssinaturaUsuarioPorIdUsuario)
app.register(BuscarAssinante)
app.register(AtualizarAssinatura)

app.listen({ port: env.SERVER_PORT }).then(() => {
  console.log(`HTTP Server running on http://localhost:${env.SERVER_PORT}/docs`)
})
