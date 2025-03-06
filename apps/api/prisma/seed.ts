import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
  await prisma.organizacao.deleteMany()
  await prisma.usuario.deleteMany()

  const passwordHash = await hash('123456', 1)

  const usuarioAdmin = await prisma.usuario.create({
    data: {
      dataNascimento: new Date(),
      nome: 'Administrador',
      numeroCelular: '5521912345670',
      email: 'adm@teste.com',
      passwordHash,
    },
  })

  const usuarioFuncionarioSalao = await prisma.usuario.create({
    data: {
      dataNascimento: new Date(),
      nome: 'Funcionario Padrão Salao',
      numeroCelular: '5521912345671',
      email: 'teste@teste.com',
      passwordHash,
    },
  })

  const usuarioFuncionarioEstetica = await prisma.usuario.create({
    data: {
      dataNascimento: new Date(),
      nome: 'Funcionario Padrão Estetica',
      numeroCelular: '5521912345675',
      email: 'teste2@teste.com',
      passwordHash,
    },
  })

  const usuarioCliente = await prisma.usuario.create({
    data: {
      dataNascimento: new Date(),
      nome: 'Cliente',
      numeroCelular: '5521912345672',
    },
  })

  const orgSalao = await prisma.organizacao.create({
    data: {
      ownerId: usuarioAdmin.id,
      nome: 'Studio salão de beleza',
      slug: 'studio-salao-de-beleza',
      cnpj: '12345678912345',
      razaoSocial: 'Studio salão de beleza',
      cep: '12230-236',
      rua: 'Nome da rua',
      bairro: 'Nome do bairro',
      cidade: 'Nome da cidade',
      estado: 'RJ',
      membros: {
        createMany: {
          data: [
            {
              usuarioId: usuarioAdmin.id,
              role: 'ADMIN',
              tipo: 'FUNCIONARIO',
            },
            {
              usuarioId: usuarioFuncionarioSalao.id,
              role: 'ATENDENTE',
              tipo: 'FUNCIONARIO',
            },
            {
              usuarioId: usuarioCliente.id,
              role: 'CLIENTE',
              tipo: 'CLIENTE',
            },
          ],
        },
      },
    },
  })

  const orgEstetica = await prisma.organizacao.create({
    data: {
      ownerId: usuarioAdmin.id,
      nome: 'Estética automotiva',
      slug: 'estetica-automotiva',
      cnpj: '22345678912345',
      razaoSocial: 'Estética automotiva',
      cep: '12230-236',
      rua: 'Nome da rua',
      bairro: 'Nome do bairro',
      cidade: 'Nome da cidade',
      estado: 'RJ',
      membros: {
        createMany: {
          data: [
            {
              usuarioId: usuarioCliente.id,
              role: 'CLIENTE',
              tipo: 'CLIENTE',
            },
            {
              usuarioId: usuarioFuncionarioEstetica.id,
              role: 'ATENDENTE',
              tipo: 'FUNCIONARIO',
            },
          ],
        },
      },
    },
  })

  const servicoLavagemDetalhada = await prisma.servico.create({
    data: {
      nome: 'Lavagem detalhada',
      descricao: 'Lavagem completa do veiculo',
      tempo: 70,
      valor: 120.5,
      organizacaoId: orgEstetica.id,
    },
  })

  const servicoLavagemSimples = await prisma.servico.create({
    data: {
      nome: 'Lavagem simples',
      descricao: 'Lavagem externa do veiculo',
      tempo: 30,
      valor: 50,
      organizacaoId: orgEstetica.id,
    },
  })

  const servicoAplicacao = await prisma.servico.create({
    data: {
      nome: 'Aplicação de unha de fibra de vidro',
      descricao: 'Aplicação de unha de fibra de vidro',
      tempo: 60,
      valor: 120,
      organizacaoId: orgSalao.id,
    },
  })

  const servicoManutencao = await prisma.servico.create({
    data: {
      nome: 'Manutenção de unha de fibra de vidro',
      descricao: 'Manutenção de unha de fibra de vidro',
      tempo: 45,
      valor: 80,
      organizacaoId: orgSalao.id,
    },
  })
}

seed().then(() => {
  console.log('Database seeded!')
})
