import { env } from '@agendamento-saas/env'

import { BadRequestError } from '@/http/routes/_errors/bad-request-error'

const { WPP_API_URL, WPP_API_KEY, WPP_API_INSTANCE_NAME, WPP_API_DELAY } = env

interface ISendMessageRequest {
  phone: string
  message: string
}

interface ISendMessageResponse {
  key: {
    remoteJid: string
    fromMe: boolean
    id: string
  }
  message: {
    extendedTextMessage: {
      text: string
    }
  }
  messageTimestamp: string
  status: string
}

export const WhatsappApi = {
  sendMessage: async ({
    message,
    phone,
  }: ISendMessageRequest): Promise<ISendMessageResponse> => {
    const response = await fetch(
      `${WPP_API_URL}/message/sendText/${WPP_API_INSTANCE_NAME}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: WPP_API_KEY,
        },
        body: JSON.stringify({
          number: phone,
          text: message,
          delay: WPP_API_DELAY,
        }),
      },
    ).then((ret) => {
      if (ret.status === 400) {
        throw new BadRequestError('O número fornecido não está no WhatsApp.')
      }
      return ret
    })

    const retApi = (await response.json()) as ISendMessageResponse

    return retApi
  },
}
