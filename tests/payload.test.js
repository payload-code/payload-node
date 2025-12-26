import { faker } from '@faker-js/faker'

import payload from '../src/payload'

import {
  customerFixture,
  processingAccountFixture,
} from './__fixtures__/accounts'
import {
  billingScheduleFixture,
  billingScheduleV2Fixture,
} from './__fixtures__/billing'

const BASE_UNSELECTABLE = ['APIKey', 'AccessToken', 'ClientToken', 'OAuthToken']

const V1_ONLY_OBJECTS = [
  'Customer',
  'ProcessingAccount',
  'BillingCharge',
  'Org',
  'Ledger',
  'LineItem',
  'ChargeItem',
  'PaymentItem',
  'LegalEntity',
  'PaymentActivation',
  'AppSettings',
]

const V2_ONLY_OBJECTS = [
  'Profile',
  'BillingItem',
  'InvoiceItem',
  'PaymentAllocation',
  'Stakeholder',
  'Transfer',
  'TransactionOperation',
]

const SHARED_OBJECTS = [
  'Account',
  'Transaction',
  'Payment',
  'Refund',
  'Credit',
  'Deposit',
  'PaymentMethod',
  'Card',
  'BankAccount',
  'BillingSchedule',
  'Invoice',
  'ProcessingSettings',
  'ProcessingRule',
  'ProcessingAgreement',
  'PaymentLink',
  'Intent',
  'Entity',
  'CheckFront',
  'CheckBack',
  'Webhook',
  'WebhookLog',
  'User',
]

describe('Test All Endpoints (V1 API)', () => {
  const unselectable = [
    ...BASE_UNSELECTABLE,
    ...V2_ONLY_OBJECTS,
    'BillingCharge', // Tested through billing schedule relationship below (V1)
  ]
  const selectable = [...V1_ONLY_OBJECTS, ...SHARED_OBJECTS].filter(
    (n) => !unselectable.includes(n),
  )

  test.each(selectable)('select objects', async (obj) => {
    expect(
      Array.isArray(await payload.select(payload[obj]).limit(1).all()),
    ).toBe(true)
  })
})

describe('Test All Endpoints (V2 API)', () => {
  const unselectable = [
    ...BASE_UNSELECTABLE,
    'BillingItem', // Tested through billing schedule relationship below (V2)
  ]
  const selectable = [...V2_ONLY_OBJECTS, ...SHARED_OBJECTS].filter(
    (n) => !unselectable.includes(n),
  )

  test.each(selectable)('select V2 objects', async (obj) => {
    const payloadV2 = payload.Session(payload.apiKey, { apiVersion: 2 })
    const result = await payloadV2.select(payloadV2[obj]).limit(1).all()
    expect(Array.isArray(result)).toBe(true)
  })
})

describe('Test Account', () => {
  let customer
  let processingAccount

  beforeAll(async () => {
    customer = await customerFixture()
    processingAccount = await processingAccountFixture()
  })

  test('create customer account', () => {
    expect(customer).toBeInstanceOf(payload.Customer)
    expect(customer).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      email: expect.any(String),
    })
  })

  test('create processing account', () => {
    expect(processingAccount).toBeInstanceOf(payload.ProcessingAccount)
    expect(processingAccount).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
    })
  })

  test('update customer', async () => {
    const newName = faker.person.fullName()
    await customer.update({
      name: newName,
    })

    expect(customer).toMatchObject({
      name: newName,
    })
  })

  test('delete customer', async () => {
    await customer.delete()

    await expect(() => payload.Customer.get(customer.id)).rejects.toThrow(
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
    expect(
      await payload.ProcessingAccount.get(processingAccount.id),
    ).toBeInstanceOf(payload.ProcessingAccount)
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

describe('Test BillingSchedule and BillingCharge (V1 API)', () => {
  let customer
  let processingAccount
  let billingSchedule

  beforeAll(async () => {
    customer = await customerFixture()
    processingAccount = await processingAccountFixture()
    billingSchedule = await billingScheduleFixture(customer, processingAccount)
  })

  test('access charge through billing schedule relationship', () => {
    const charge = billingSchedule.charges[0]
    expect(charge).toBeInstanceOf(payload.BillingCharge)
    expect(charge.amount).toBe(5.0)
    expect(charge.billing_schedule_id).toBe(billingSchedule.id)
  })
})

describe('Test BillingSchedule and BillingItem (V2 API)', () => {
  let customer
  let processingAccount
  let billingSchedule
  let payloadV2

  beforeAll(async () => {
    customer = await customerFixture()
    processingAccount = await processingAccountFixture()
    payloadV2 = payload.Session(payload.apiKey, { apiVersion: 2 })
    billingSchedule = await billingScheduleV2Fixture(
      payloadV2,
      customer,
      processingAccount,
    )
  })

  test('access item through billing schedule relationship', () => {
    const item = billingSchedule.items[0]
    expect(item).toBeInstanceOf(payloadV2.BillingItem)
    expect(item.type).toBe('line_item')
    expect(item.line_item.value).toBe(5.0)
    expect(item.billing_schedule_id).toBe(billingSchedule.id)
  })
})
