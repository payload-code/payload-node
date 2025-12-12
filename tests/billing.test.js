import payload from '../src/payload'
import { customerFixture, processingAccountFixture } from './__fixtures__/accounts'
import { billingScheduleFixture } from './__fixtures__/billing'

describe('Test Billing', () => {
  let billingSchedule
  let proc
  let cust

  beforeAll(async () => {
    cust = await customerFixture()
    proc = await processingAccountFixture()
    billingSchedule = await billingScheduleFixture(cust, proc)
  })

  test('create billing schedule', () => {
    expect(billingSchedule.processing_id).toBe(proc.id)
    expect(billingSchedule.charges[0].amount).toBe(39.99)
  })

  test('update billing schedule frequency', async () => {
    expect(billingSchedule.processing_id).toBe(proc.id)
    expect(billingSchedule.charges[0].amount).toBe(39.99)

    await billingSchedule.update({ recurring_frequency: 'quarterly' })

    expect(billingSchedule.recurring_frequency).toBe('quarterly')
  })

  test('delete billing schedule', async () => {
    const testBillingSchedule = await billingScheduleFixture(cust, proc)
    await testBillingSchedule.delete()

    await expect(() =>
      payload.BillingSchedule.get(testBillingSchedule.id),
    ).rejects.toThrow(payload.NotFound)
  })
})
