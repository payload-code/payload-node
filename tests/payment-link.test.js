import payload from '../src/payload'
import { processingAccountFixture } from './__fixtures__/accounts'
import {
  paymentLinkOneTimeFixture,
  paymentLinkReusableFixture,
} from './__fixtures__/payment-links'

describe('Test Payment Link', () => {
  let proc

  beforeAll(async () => {
    proc = await processingAccountFixture()
  })

  test('create payment link one time', async () => {
    const paymentLink = await paymentLinkOneTimeFixture(proc)

    expect(paymentLink.processing_id).toBe(proc.id)
    expect(paymentLink.type).toBe('one_time')
  })

  test('create payment link reusable', async () => {
    const paymentLink = await paymentLinkReusableFixture(proc)

    expect(paymentLink.processing_id).toBe(proc.id)
    expect(paymentLink.type).toBe('reusable')
  })

  test('delete payment link reusable', async () => {
    const paymentLink = await paymentLinkReusableFixture(proc)
    await paymentLink.delete()

    await expect(payload.PaymentLink.get(paymentLink.id)).rejects.toThrow(
      payload.NotFound,
    )
  })

  test('delete payment link one time', async () => {
    const paymentLink = await paymentLinkOneTimeFixture(proc)
    await paymentLink.delete()

    await expect(payload.PaymentLink.get(paymentLink.id)).rejects.toThrow(
      payload.NotFound,
    )
  })
})

