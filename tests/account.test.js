import { faker } from '@faker-js/faker'
import payload from '../src/payload'
import {
  customerFixture,
  processingAccountFixture,
  customerV2Fixture,
  processingAccountV2Fixture,
} from './__fixtures__/accounts'

describe('Test Account', () => {
  test('create customer account', async () => {
    const customerAccount = await payload.Customer.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
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
    const randEmail1 = faker.internet.email()
    const randEmail2 = faker.internet.email()

    await payload.create([
      payload.Customer({ email: randEmail1, name: faker.person.fullName() }),
      payload.Customer({ email: randEmail2, name: faker.person.fullName() }),
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
      payload.Customer({ email: faker.internet.email(), name: faker.person.fullName() }),
      payload.Customer({ email: faker.internet.email(), name: faker.person.fullName() }),
      payload.Customer({ email: faker.internet.email(), name: faker.person.fullName() }),
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
    const newEmail = faker.internet.email()
    await customerAccount.update({ email: newEmail })

    expect(customerAccount.email).toBe(newEmail)
  })

  test('update mult acc', async () => {
    const customerAccount1 = await payload.Customer.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
    })
    const customerAccount2 = await payload.Customer.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
    })

    const newEmail1 = faker.internet.email()
    const newEmail2 = faker.internet.email()

    await payload.update([
      [customerAccount1, { email: newEmail1 }],
      [customerAccount2, { email: newEmail2 }],
    ])

    expect(customerAccount1.email).toBe(newEmail1)
    expect(customerAccount2.email).toBe(newEmail2)
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

describe('Test Account (V2 API)', () => {
  let payloadV2

  beforeAll(() => {
    payloadV2 = payload.Session(payload.apiKey, { apiVersion: 'v2' })
  })

  test('create customer account', async () => {
    const customerAccount = await payloadV2.Account.create({
      type: 'customer',
      name: faker.person.fullName(),
      contact_details: {
        email: faker.internet.email(),
      },
    })

    expect(customerAccount.id).toBeTruthy()
    expect(customerAccount.type).toBe('customer')
  })

  test('delete', async () => {
    const customerAccount = await customerV2Fixture(payloadV2)
    await customerAccount.delete()

    await expect(() => payloadV2.Account.get(customerAccount.id)).rejects.toThrow(
      payloadV2.NotFound,
    )
  })

  test('create mult accounts', async () => {
    const randEmail1 = faker.internet.email()
    const randEmail2 = faker.internet.email()

    await payloadV2.create([
      payloadV2.Account({
        type: 'customer',
        name: faker.person.fullName(),
        contact_details: { email: randEmail1 },
      }),
      payloadV2.Account({
        type: 'customer',
        name: faker.person.fullName(),
        contact_details: { email: randEmail2 },
      }),
    ])

    const accounts = await payloadV2.Account.filterBy({ type: 'customer' }).all()
    const getAccount1 = accounts.find((a) => a.contact_details?.email === randEmail1)
    const getAccount2 = accounts.find((a) => a.contact_details?.email === randEmail2)

    expect(getAccount1).toBeTruthy()
    expect(getAccount2).toBeTruthy()
  })

  test('get processing account', async () => {
    const processingAccount = await processingAccountV2Fixture(payloadV2)
    expect(await payloadV2.Account.get(processingAccount.id)).toBeTruthy()
    // V2 uses processing.status.funding instead of status directly
    expect(processingAccount.processing?.status?.funding).toBe('pending')
    expect(processingAccount.type).toBe('processing')
  })

  test('paging and ordering results', async () => {
    await payloadV2.create([
      payloadV2.Account({
        type: 'customer',
        name: faker.person.fullName(),
        contact_details: { email: faker.internet.email() },
      }),
      payloadV2.Account({
        type: 'customer',
        name: faker.person.fullName(),
        contact_details: { email: faker.internet.email() },
      }),
      payloadV2.Account({
        type: 'customer',
        name: faker.person.fullName(),
        contact_details: { email: faker.internet.email() },
      }),
    ])

    const customers = await payloadV2
      .select(payloadV2.Account)
      .filterBy({ type: 'customer' })
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

  test('update customer', async () => {
    const customerAccount = await customerV2Fixture(payloadV2)
    const newEmail = faker.internet.email()
    await customerAccount.update({
      contact_details: { email: newEmail },
    })

    expect(customerAccount.contact_details.email).toBe(newEmail)
  })

  test('update mult acc', async () => {
    const customerAccount1 = await payloadV2.Account.create({
      type: 'customer',
      name: faker.person.fullName(),
      contact_details: { email: faker.internet.email() },
    })
    const customerAccount2 = await payloadV2.Account.create({
      type: 'customer',
      name: faker.person.fullName(),
      contact_details: { email: faker.internet.email() },
    })

    const newEmail1 = faker.internet.email()
    const newEmail2 = faker.internet.email()

    await payloadV2.update([
      [customerAccount1, { contact_details: { email: newEmail1 } }],
      [customerAccount2, { contact_details: { email: newEmail2 } }],
    ])

    expect(customerAccount1.contact_details.email).toBe(newEmail1)
    expect(customerAccount2.contact_details.email).toBe(newEmail2)
  })

  test('get customer', async () => {
    const customerAccount = await customerV2Fixture(payloadV2)
    expect(await payloadV2.Account.get(customerAccount.id)).toBeTruthy()
  })

  test('select customer attribute', async () => {
    const customerAccount = await customerV2Fixture(payloadV2)
    const selectedCustomer = await payloadV2.select(payloadV2.Account).select('id').get(customerAccount.id)
    expect(selectedCustomer.id).toBe(customerAccount.id)
  })
})
