import { FastifyInstance } from 'fastify'
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod'
import { ZodError } from 'zod'

import { BadRequestError } from './routes/_errors/bad-request-error'
import { UnauthorizedError } from './routes/_errors/unauthorized-error'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    const errors = error.flatten().fieldErrors
    console.log(errors)
    return reply.status(400).send({
      message: 'Validation error',
      errors,
    })
  }

  if (hasZodFastifySchemaValidationErrors(error)) {
    const errorList = error.validation.map((err) => err.params.issue)
    console.log(errorList)
    return reply.status(400).send({
      message: 'Validation error',
      errors: errorList.map((e) => e.path + ': ' + e.message).join(', '),
    })
  }

  if (error instanceof BadRequestError) {
    return reply.status(400).send({
      message: error.message,
    })
  }

  if (error instanceof UnauthorizedError) {
    return reply.status(401).send({
      message: error.message,
    })
  }

  console.error(error)

  return reply.status(500).send({ message: 'Internal server error' })
}
