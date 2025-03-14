import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
  await prisma.organizacao.deleteMany()
  await prisma.usuario.deleteMany()

  const passwordHash = await hash('123456', 1)

  const usuarioAdminSalao = await prisma.usuario.create({
    data: {
      dataNascimento: new Date(),
      nome: 'Administrador Salao',
      numeroCelular: '+5521000000000',
      email: 'adm@salao.com',
      avatarUrl:
        'https://i0.wp.com/jornaldoempreendedor.com.br/wp-content/uploads/2015/06/mulher-empreendedora.jpg?fit=1600%2C1254&ssl=1',
      passwordHash,
    },
  })

  const usuarioAtendenteSalao = await prisma.usuario.create({
    data: {
      dataNascimento: new Date(),
      nome: 'Atendente 01 Salao',
      numeroCelular: '+5521000000001',
      email: 'atendente1@salao.com',
      avatarUrl:
        'https://s2-g1.glbimg.com/dOaBYw8LDA7nojr-Pi_MHzDferg=/0x0:840x825/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2022/2/8/1vgIApSjag8YxiTXBIIA/aline-manicure.jpeg',
      passwordHash,
    },
  })

  const usuarioAtendente2Salao = await prisma.usuario.create({
    data: {
      dataNascimento: new Date(),
      nome: 'Atendente 02 Salao',
      numeroCelular: '+5521000000002',
      email: 'atendente2@tessalaote.com',
      avatarUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD-YUeQabWU5byCkP78xA0bynLf5M_waZlIq2T6Eu9yF8-RckuB-3YAMeRsmCQtTqfBJ8&usqp=CAU',
      passwordHash,
    },
  })

  const usuarioAdminEstetica = await prisma.usuario.create({
    data: {
      dataNascimento: new Date(),
      nome: 'Administrador Estetica',
      numeroCelular: '+5521000000003',
      email: 'adm@estetica.com',
      avatarUrl:
        'https://clinicagenics.com/wp-content/uploads/2022/07/close-up-confident-male-employee-white-collar-shirt-smiling-camera-standing-self-assured-against-studio-background.jpg',
      passwordHash,
    },
  })

  const usuarioAtendenteEstetica = await prisma.usuario.create({
    data: {
      dataNascimento: new Date(),
      nome: 'Atendente 01 Estetica',
      numeroCelular: '+5521000000004',
      email: 'atendente1@estetica.com',
      avatarUrl:
        'https://cdn.acritica.net/upload/dn_arquivo/2021/07/douglas-queiroz-2.jpg',
      passwordHash,
    },
  })

  const usuarioCliente1 = await prisma.usuario.create({
    data: {
      dataNascimento: new Date(),
      nome: 'Cliente 01',
      numeroCelular: '+5521000000005',
    },
  })

  const usuarioCliente2 = await prisma.usuario.create({
    data: {
      dataNascimento: new Date(),
      nome: 'Cliente 02',
      numeroCelular: '+5521000000006',
    },
  })

  const orgSalao = await prisma.organizacao.create({
    data: {
      ownerId: usuarioAdminSalao.id,
      nome: 'Studio salão de beleza',
      slug: 'studio-salao-de-beleza',
      cnpj: '12345678912345',
      razaoSocial: 'Studio salão de beleza',
      cep: '12230-236',
      rua: 'Nome da rua',
      bairro: 'Nome do bairro',
      cidade: 'Nome da cidade',
      estado: 'RJ',
      avatarUrl:
        'https://www.negociosemfoco.com/wp-content/uploads/2022/11/dicas-montar-salao-beleza-sucesso.jpg',
      membros: {
        createMany: {
          data: [
            {
              usuarioId: usuarioAdminSalao.id,
              role: 'ADMIN',
              tipo: 'FUNCIONARIO',
            },
            {
              usuarioId: usuarioCliente1.id,
              role: 'CLIENTE',
              tipo: 'CLIENTE',
            },
          ],
        },
      },
    },
  })

  const membroAtendente1Salao = await prisma.membro.create({
    data: {
      role: 'ATENDENTE',
      tipo: 'FUNCIONARIO',
      organizacaoId: orgSalao.id,
      usuarioId: usuarioAtendenteSalao.id,
    },
  })

  const membroAtendente2Salao = await prisma.membro.create({
    data: {
      role: 'ATENDENTE',
      tipo: 'FUNCIONARIO',
      organizacaoId: orgSalao.id,
      usuarioId: usuarioAtendente2Salao.id,
    },
  })

  const orgEstetica = await prisma.organizacao.create({
    data: {
      ownerId: usuarioAdminEstetica.id,
      nome: 'Estética automotiva',
      slug: 'estetica-automotiva',
      cnpj: '22345678912345',
      razaoSocial: 'Estética automotiva',
      cep: '12230-236',
      rua: 'Nome da rua',
      bairro: 'Nome do bairro',
      cidade: 'Nome da cidade',
      estado: 'RJ',
      avatarUrl:
        'https://maisexpressao.com.br/imagens/noticias/70886/640x480/foto-lexus-detalhamento-1.jpeg',
      membros: {
        createMany: {
          data: [
            {
              usuarioId: usuarioAdminEstetica.id,
              role: 'ADMIN',
              tipo: 'FUNCIONARIO',
            },
            {
              usuarioId: usuarioCliente1.id,
              role: 'CLIENTE',
              tipo: 'CLIENTE',
            },
            {
              usuarioId: usuarioCliente2.id,
              role: 'CLIENTE',
              tipo: 'CLIENTE',
            },
          ],
        },
      },
    },
  })

  const membroAtendente1Estetica = await prisma.membro.create({
    data: {
      role: 'ATENDENTE',
      tipo: 'FUNCIONARIO',
      organizacaoId: orgEstetica.id,
      usuarioId: usuarioAtendenteEstetica.id,
    },
  })

  const servico01Salao = await prisma.servico.create({
    data: {
      nome: 'Aplicação de fibra de vidro',
      descricao: 'Aplicação de unha em fibra de vidro',
      tempo: 60,
      valor: 120,
      organizacaoId: orgSalao.id,
      avatarUrl:
        'https://pvbeauty.com.br/wp-content/uploads/2024/08/unhas-fibra-de-vidro-salao-cabeleireiro-moema-09.webp',
    },
  })

  const servico02Salao = await prisma.servico.create({
    data: {
      nome: 'Manutenção de unha de fibra de vidro',
      descricao: 'Manutenção de unha de fibra de vidro',
      tempo: 45,
      valor: 80,
      organizacaoId: orgSalao.id,
      avatarUrl:
        'https://i.pinimg.com/originals/83/32/ff/8332ff0f8e0d3abadf62f0afb44ad4a1.jpg',
    },
  })

  const servico03Salao = await prisma.servico.create({
    data: {
      nome: 'Decoração',
      descricao: 'Decoração sem aplicação ou manutenção',
      tempo: 20,
      valor: 35,
      organizacaoId: orgSalao.id,
      avatarUrl:
        'https://http2.mlstatic.com/D_NQ_NP_954564-MLB76143630472_052024-O.webp',
    },
  })

  const servico01Estetica = await prisma.servico.create({
    data: {
      nome: 'Lavagem detalhada',
      descricao: 'Lavagem completa do veiculo',
      tempo: 70,
      valor: 120.5,
      organizacaoId: orgEstetica.id,
      avatarUrl:
        'https://www.tecfil.com.br/wp-content/uploads/2022/01/TECFIL_IMG_02_04.jpg',
    },
  })

  const servico02Estetica = await prisma.servico.create({
    data: {
      nome: 'Lavagem simples',
      descricao: 'Lavagem externa do veiculo',
      tempo: 45,
      valor: 50,
      organizacaoId: orgEstetica.id,
      avatarUrl:
        'https://blog.thinkseg.com/wp-content/uploads/2020/06/c6352a6c-como-lavar-carro-em-casa.jpg',
    },
  })

  const servico03Estetica = await prisma.servico.create({
    data: {
      nome: 'Plimento',
      descricao: 'Polimento e aplicação de cera para proteção da pintura',
      tempo: 60,
      valor: 250,
      organizacaoId: orgEstetica.id,
      avatarUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3zo6PCOfnOnQpQsRno8P0GVAMoLVnvAIkSw&s',
    },
  })

  const expedienteAtendente01Salao = await prisma.expediente.create({
    data: {
      nome: '2024',
      expedientePrincipal: false,
      membroId: membroAtendente1Salao.id,
    },
  })

  const diasExpedienteAtendente01Salao = await prisma.diasExpediente.create({
    data: {
      diaSemana: 2,
      inicio: '08:00',
      fim: '17:00',
      expedienteId: expedienteAtendente01Salao.id,
    },
  })

  const expediente2Atendente01Salao = await prisma.expediente.create({
    data: {
      nome: '2025',
      expedientePrincipal: true,
      membroId: membroAtendente1Salao.id,
    },
  })

  const diasExpediente2Atendente01Salao =
    await prisma.diasExpediente.createMany({
      data: [
        {
          diaSemana: 1,
          inicio: '08:00',
          fim: '17:00',
          inicioIntervalo: '12:00',
          fimIntervalo: '13:00',
          expedienteId: expediente2Atendente01Salao.id,
        },
        {
          diaSemana: 2,
          inicio: '08:00',
          fim: '17:00',
          inicioIntervalo: '12:00',
          fimIntervalo: '13:00',
          expedienteId: expediente2Atendente01Salao.id,
        },
        {
          diaSemana: 4,
          inicio: '08:00',
          fim: '19:00',
          inicioIntervalo: '12:00',
          fimIntervalo: '13:00',
          expedienteId: expediente2Atendente01Salao.id,
        },
        {
          diaSemana: 5,
          inicio: '08:00',
          fim: '16:00',
          inicioIntervalo: '12:00',
          fimIntervalo: '13:00',
          expedienteId: expediente2Atendente01Salao.id,
        },
        {
          diaSemana: 7,
          inicio: '07:00',
          fim: '13:30',
          expedienteId: expediente2Atendente01Salao.id,
        },
      ],
    })

  const expedienteAtendente02Salao = await prisma.expediente.create({
    data: {
      nome: 'Meu expediente principal',
      expedientePrincipal: true,
      membroId: membroAtendente2Salao.id,
    },
  })

  const diasExpedienteAtendente02Salao = await prisma.diasExpediente.createMany(
    {
      data: [
        {
          diaSemana: 1,
          inicio: '07:00',
          fim: '19:00',
          inicioIntervalo: '12:00',
          fimIntervalo: '13:00',
          expedienteId: expedienteAtendente02Salao.id,
        },
        {
          diaSemana: 4,
          inicio: '07:00',
          fim: '19:00',
          inicioIntervalo: '12:00',
          fimIntervalo: '13:00',
          expedienteId: expedienteAtendente02Salao.id,
        },
        {
          diaSemana: 7,
          inicio: '07:00',
          fim: '15:00',
          expedienteId: expedienteAtendente02Salao.id,
        },
      ],
    },
  )

  const expedienteAtendente01Estetica = await prisma.expediente.create({
    data: {
      nome: 'Atual 2025',
      expedientePrincipal: true,
      membroId: membroAtendente1Estetica.id,
    },
  })

  const diasExpedienteAtendente01Estetica =
    await prisma.diasExpediente.createMany({
      data: [
        {
          diaSemana: 1,
          inicio: '08:00',
          fim: '18:00',
          inicioIntervalo: '12:00',
          fimIntervalo: '13:00',
          expedienteId: expedienteAtendente01Estetica.id,
        },
        {
          diaSemana: 2,
          inicio: '08:00',
          fim: '18:00',
          inicioIntervalo: '12:00',
          fimIntervalo: '13:00',
          expedienteId: expedienteAtendente01Estetica.id,
        },
        {
          diaSemana: 3,
          inicio: '08:00',
          fim: '18:00',
          inicioIntervalo: '12:00',
          fimIntervalo: '13:00',
          expedienteId: expedienteAtendente01Estetica.id,
        },
        {
          diaSemana: 4,
          inicio: '08:00',
          fim: '18:00',
          inicioIntervalo: '12:00',
          fimIntervalo: '13:00',
          expedienteId: expedienteAtendente01Estetica.id,
        },
        {
          diaSemana: 5,
          inicio: '08:00',
          fim: '18:00',
          inicioIntervalo: '12:00',
          fimIntervalo: '13:00',
          expedienteId: expedienteAtendente01Estetica.id,
        },
        {
          diaSemana: 6,
          inicio: '08:00',
          fim: '18:00',
          inicioIntervalo: '12:00',
          fimIntervalo: '13:00',
          expedienteId: expedienteAtendente01Estetica.id,
        },
        {
          diaSemana: 7,
          inicio: '07:00',
          fim: '13:30',
          expedienteId: expedienteAtendente01Estetica.id,
        },
      ],
    })
}

seed().then(() => {
  console.log('Database seeded!')
})
