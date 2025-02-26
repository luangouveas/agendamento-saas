export const gerarSenhaAleatoria = (tamanho: number) =>
  [...Array(tamanho)].map(() => Math.random().toString(36)[2]).join('')
