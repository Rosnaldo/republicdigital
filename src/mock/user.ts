import { User } from '@prisma/client'

export const MockUser = (): User => ({
  id: '5d666862-01ad-40b5-b9ac-4332a8dd4191',
  name: 'Andrey',
  cpf: '52998224725',
  createdAt: new Date()
})

export const MockUser2 = (): User => ({
  id: '857ef810-d6fa-4203-b4ad-84008fb72095',
  name: 'Jojo',
  cpf: '94795967253',
  createdAt: new Date()
})
