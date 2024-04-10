import { faker } from '@faker-js/faker'

import payload from '../src/payload'
import * as objects from '../src/objects'

import {
  customerFixture,
  processingAccountFixture,
} from './__fixtures__/accounts'

describe('Test All Endpoints', () => {
  const unselectable = ['APIKey', 'AccessToken', 'ClientToken', 'OAuthToken']
  const selectable = Object.keys(objects).filter(
    (n) => !unselectable.includes(n),
  )

  test.each(selectable)('select objects', async (obj) => {
    expect(
      Array.isArray(await payload.select(payload[obj]).limit(1).all()),
    ).toBe(true)
  })
})

describe('Test Account', () => {
  let cust
  let proc

  beforeAll(async () => {
    cust = await customerFixture()
    proc = await processingAccountFixture()
  })

  test('create customer account', () => {
    expect(cust).toBeInstanceOf(payload.Customer)
    expect(cust).toMatchObject({
      id: expect.any(String),
      name: 'Customer Account',
      email: 'customer@example.com',
    })
  })

  test('create processing account', () => {
    expect(proc).toBeInstanceOf(payload.ProcessingAccount)
    expect(proc).toMatchObject({
      id: expect.any(String),
      name: 'Processing Account',
    })
  })

  test('update customer', async () => {
    await cust.update({
      name: 'Updated User',
    })

    expect(cust).toMatchObject({
      name: 'Updated User',
    })
  })

  test('delete customer', async () => {
    await cust.delete()

    await expect(() => payload.Customer.get(cust.id)).rejects.toThrow(
      payload.NotFound,
    )
  })

  test('create multiple customers', async () => {
    const randEmail1 = faker.internet.email()
    const randEmail2 = faker.internet.email()

    await payload.create([
      payload.Customer({ email: randEmail1, name: faker.person.fullName() }),
      payload.Customer({ email: randEmail2, name: faker.person.fullName() }),
    ])

    const [getAccount1] = await payload
      .select(payload.Customer)
      .filterBy({ email: randEmail1 })
      .all()
    const [getAccount2] = await payload
      .select(payload.Customer)
      .filterBy({ email: randEmail2 })
      .all()

    expect(getAccount1).toBeInstanceOf(payload.Customer)
    expect(getAccount2).toBeInstanceOf(payload.Customer)
  })

  test('get processing account', async () => {
    expect(await payload.ProcessingAccount.get(proc.id)).toBeInstanceOf(
      payload.ProcessingAccount,
    )
  })

  test('paging and ordering', async () => {
    await payload.create([
      payload.Customer({
        email: faker.internet.email(),
        name: faker.person.fullName(),
      }),
      payload.Customer({
        email: faker.internet.email(),
        name: faker.person.fullName(),
      }),
      payload.Customer({
        email: faker.internet.email(),
        name: faker.person.fullName(),
      }),
    ])

    const orderedAccounts = await payload
      .select(payload.Customer)
      .orderBy('created_at')
      .limit(3)
      .offset(1)
      .all()

    expect(orderedAccounts.length).toBe(3)

    expect(
      new Date(orderedAccounts[0].created_at) <=
        new Date(orderedAccounts[1].created_at),
    ).toBe(true)
    expect(
      new Date(orderedAccounts[1].created_at) <=
        new Date(orderedAccounts[2].created_at),
    ).toBe(true)
  })
})
