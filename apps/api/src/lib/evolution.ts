import { env } from '@agendamento-saas/env'

import { BadRequestError } from '@/http/routes/_errors/bad-request-error'

const { WPP_API_URL, WPP_API_KEY, WPP_API_INSTANCE_NAME, WPP_API_DELAY } = env

interface ISendMessage {
  phone: string
  message: string
}

export const evolutionApi = {
  sendMessage: async ({ message, phone }: ISendMessage) => {
    return fetch(`${WPP_API_URL}/message/sendText/${WPP_API_INSTANCE_NAME}`, {
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
    })
  },
}
