import payload from '../src/payload'
import {
  customerFixture,
  processingAccountFixture,
  customerV2Fixture,
  processingAccountV2Fixture,
} from './__fixtures__/accounts'
import { billingScheduleFixture, billingScheduleV2Fixture } from './__fixtures__/billing'

describe('Test Billing', () => {
  let billingSchedule
  let processingAccount
  let customer

  beforeAll(async () => {
    customer = await customerFixture()
    processingAccount = await processingAccountFixture()
    billingSchedule = await billingScheduleFixture(customer, processingAccount)
  })

  test('create billing schedule', () => {
    expect(billingSchedule.processing_id).toBe(processingAccount.id)
    expect(billingSchedule.charges[0].amount).toBe(5.00)
  })

  test('update billing schedule frequency', async () => {
    expect(billingSchedule.processing_id).toBe(processingAccount.id)
    expect(billingSchedule.charges[0].amount).toBe(5.00)

    await billingSchedule.update({ recurring_frequency: 'quarterly' })

    expect(billingSchedule.recurring_frequency).toBe('quarterly')
  })

  test('delete billing schedule', async () => {
    const testBillingSchedule = await billingScheduleFixture(customer, processingAccount)
    await testBillingSchedule.delete()

    await expect(() =>
      payload.BillingSchedule.get(testBillingSchedule.id),
    ).rejects.toThrow(payload.NotFound)
  })
})

describe('Test Billing (V2 API)', () => {
  let billingSchedule
  let processingAccount
  let customer
  let payloadV2

  beforeAll(async () => {
    payloadV2 = payload.Session(payload.apiKey, { apiVersion: 'v2' })
    customer = await customerV2Fixture(payloadV2)
    processingAccount = await processingAccountV2Fixture(payloadV2)
    billingSchedule = await billingScheduleV2Fixture(payloadV2, customer, processingAccount)
  })

  test('create billing schedule', () => {
    expect(billingSchedule.biller.account_id).toBe(processingAccount.id)
    expect(billingSchedule.items[0].line_item.value).toBe(5.00)
  })

  test('update billing schedule frequency', async () => {
    expect(billingSchedule.biller.account_id).toBe(processingAccount.id)
    expect(billingSchedule.items[0].line_item.value).toBe(5.00)

    await billingSchedule.update({
      recurring_schedule: { type: 'daily' },
    })

    expect(billingSchedule.recurring_schedule.type).toBe('daily')
  })

  test('delete billing schedule', async () => {
    const testBillingSchedule = await billingScheduleV2Fixture(
      payloadV2,
      customer,
      processingAccount,
    )
    await testBillingSchedule.delete()

    await expect(() =>
      payloadV2.BillingSchedule.get(testBillingSchedule.id),
    ).rejects.toThrow(payloadV2.NotFound)
  })
})
