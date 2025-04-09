import ky from 'ky'

export const brasilApi = ky.create({
  prefixUrl: 'https://brasilapi.com.br/api',
})
