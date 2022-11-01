import { User } from '@prisma/client'

export const MockUser = (): User => ({
  id: '5d666862-01ad-40b5-b9ac-4332a8dd4191',
  name: 'Andrey',
  cpf: '52998224725',
  password: 'Jbfyu63nd',
  createdAt: new Date()
})
