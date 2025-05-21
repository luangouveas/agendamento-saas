# Agendador SaaS

Este projeto contempla uma aplicação fullstack "multi-tenant" para agendamento e realização de serviços, utilizando Next.Js incluindo autorização com RBAC, autenticação via email/senha e acesso OTP via Whatsapp, controle de assinatura via Stripe.

## Principais Caracteristicas

### Autenticação

- Autenticação administrativa com email e senha no painel
- Autenticação via acesso OTP com token enviado via Whatsapp para clientes

### Autorização

Controle de autorização RBAC com CASL utilizando "roles" e "permissions".

#### Roles

- ADMIN
- ATENDENTE
- CLIENTE

#### Tabela de permissões

|                           | ADMIN | ATENDENTE | CLIENTE |
| ------------------------- | ----- | --------- | --------|
| Criar estabelecimento     | ✅    | ❌       | ❌      |
| Atualizar estabelecimento | ✅    | ❌       | ❌      |
| Excluir estabelecimento   | ✅    | ❌       | ❌      |
| Associar profissional     | ✅    | ❌       | ❌      |
| Visualizar profissionais  | ✅    | ❌       | ❌      |
| Remover profissional      | ✅    | ❌       | ❌      |
| Criar serviço             | ✅    | ❌       | ❌      |
| Visualizar serviços       | ✅    | ❌       | ❌      |
| Atualizar serviço         | ✅    | ❌       | ❌      |
| Excluir serviço           | ✅    | ❌       | ❌      |
| Criar expediente          | ✅    | ❌       | ❌      |
| Visualizar expedientes    | ✅    | ❌       | ❌      |
| Atualizar expediente      | ✅    | ❌       | ❌      |
| Criar agendamento         | ✅    | ⚠️       | ⚠️      |
| Visualizar agendamentos   | ✅    | ⚠️       | ⚠️      |
| Atualizar agendamento     | ✅    | ⚠️       | ⚠️      |
| Confirmar agendamento     | ✅    | ⚠️       | ⚠️      |
| Cancelar agendamento      | ✅    | ⚠️       | ⚠️      |
| Concluir agendamento      | ✅    | ✅       | ❌      |
| Atualizar usuário         | ⚠️    | ⚠️       | ⚠️      |

> ✅ = permitido
> ❌ = não permitido
> ⚠️ = permitido com restrição

#### Condições

- Atendente só pode visualizar, criar, atualizar econfirmar agendamentos que estejam atrelados a ele como atendente.
- Atendente só pode atualizar seu próprio usuário.
- Cliente só pode visualizar, criar, atualizar econfirmar agendamentos que estejam atrelados a ele como cliente.
- Cliente só pode atualizar seu próprio usuário.
- Admin só pode atualizar seu próprio usuário.

### Agendador

Área que permite o cliente realizar o próprio agendamento escolhendo:

- Serviço, profissional, dia e horario de preferencia.
- Controle dos agendamentos agendados e realizados

### Painel administrativo

Área de acesso restrito a proprietários para gerenciamento dos seus estabelecimentos:

- Cadastro e atualização de serviços
- Cadastro e atualização de profissionais
  - Associação à profissionais que já possuem conta na plataforma
  - Convite a criação de conta na plataforma e associação imediata ao estabelecimento
- Gerenciamento de assinatura via integração com Stripe

### Controle de assinatura

Sistema gerencia a assinatura do proprietário de forma global, permitindo transitar entre os planos FREE e PRO a qualquer momento, fazendo o controle de permissões baseado no nivel da assinatura atual.

|                          | FREE    | PRO    |
| ------------------------ | ------- | -------|
| Estabelecimentos         | 1       | 5      |
| Serviços                 | 3       | 50     |
| Profissionais            | 5       | 10     |
