import { faker } from '@faker-js/faker'
import { parseISO, parse } from 'date-fns'

import payload from '../src/payload'
import { customerFixture, processingAccountFixture } from './__fixtures__/accounts'

describe('Test Account', () => {
  test('create customer account', async () => {
    const customerAccount = await payload.Customer.create({
      name: 'Test',
      email: 'test@example.com',
    })

    expect(customerAccount.id).toBeTruthy()
  })

  test('delete', async () => {
    const customerAccount = await customerFixture()
    await customerAccount.delete()

    await expect(() => payload.Customer.get(customerAccount.id)).rejects.toThrow(
      payload.NotFound,
    )
  })

  test('create mult accounts', async () => {
    const letters = 'abcdefghijklmnopqrstuvwxyz'
    const randEmail1 =
      Array.from({ length: 5 }, () => letters[Math.floor(Math.random() * letters.length)]).join('') +
      '@example.com'
    const randEmail2 =
      Array.from({ length: 5 }, () => letters[Math.floor(Math.random() * letters.length)]).join('') +
      '@example.com'

    await payload.create([
      payload.Customer({ email: randEmail1, name: 'Matt Perez' }),
      payload.Customer({ email: randEmail2, name: 'Andrea Kearney' }),
    ])

    const getAccount1 = (await payload.Customer.filterBy({ email: randEmail1 }).all())[0]
    const getAccount2 = (await payload.Customer.filterBy({ email: randEmail2 }).all())[0]

    expect(getAccount1).toBeTruthy()
    expect(getAccount2).toBeTruthy()
  })

  test('get processing account', async () => {
    const processingAccount = await processingAccountFixture()
    expect(await payload.ProcessingAccount.get(processingAccount.id)).toBeTruthy()
    expect(processingAccount.status).toBe('pending')
  })

  test('paging and ordering results', async () => {
    await payload.create([
      payload.Customer({ email: 'account1@example.com', name: 'Randy Robson' }),
      payload.Customer({ email: 'account2@example.com', name: 'Brandy Bobson' }),
      payload.Customer({ email: 'account3@example.com', name: 'Mandy Johnson' }),
    ])

    const customers = await payload
      .select(payload.Customer)
      .orderBy('created_at')
      .limit(3)
      .offset(1)
      .all()

    expect(customers.length).toBeGreaterThan(0)
    expect(customers.length).toBeLessThanOrEqual(3)

    if (customers.length > 1) {
      for (let i = 1; i < customers.length; i++) {
        const prevDate = new Date(customers[i - 1].created_at)
        const currDate = new Date(customers[i].created_at)
        expect(prevDate <= currDate).toBe(true)
      }
    }
  })

  test('update cust', async () => {
    const customerAccount = await customerFixture()
    await customerAccount.update({ email: 'test2@example.com' })

    expect(customerAccount.email).toBe('test2@example.com')
  })

  test('update mult acc', async () => {
    const customerAccount1 = await payload.Customer.create({
      name: 'Brandy',
      email: 'test1@example.com',
    })
    const customerAccount2 = await payload.Customer.create({
      name: 'Sandy',
      email: 'test2@example.com',
    })

    await payload.update([
      [customerAccount1, { email: 'brandy@example.com' }],
      [customerAccount2, { email: 'sandy@example.com' }],
    ])

    expect(customerAccount1.email).toBe('brandy@example.com')
    expect(customerAccount2.email).toBe('sandy@example.com')
  })

  test('get cust', async () => {
    const customerAccount = await customerFixture()
    expect(await payload.Customer.get(customerAccount.id)).toBeTruthy()
  })

  test('select cust attr', async () => {
    const customerAccount = await customerFixture()
    const selectedCustomer = await payload.select(payload.Customer).select('id').get(customerAccount.id)
    expect(selectedCustomer.id).toBe(customerAccount.id)
  })
})
