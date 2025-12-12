import payload from '../src/payload'
import { processingAccountFixture } from './__fixtures__/accounts'
import {
  paymentLinkOneTimeFixture,
  paymentLinkReusableFixture,
} from './__fixtures__/payment-links'

describe('Test Payment Link', () => {
  let processingAccount

  beforeAll(async () => {
    processingAccount = await processingAccountFixture()
  })

  test('create payment link one time', async () => {
    const paymentLink = await paymentLinkOneTimeFixture(processingAccount)

    expect(paymentLink.processing_id).toBe(processingAccount.id)
    expect(paymentLink.type).toBe('one_time')
  })

  test('create payment link reusable', async () => {
    const paymentLink = await paymentLinkReusableFixture(processingAccount)

    expect(paymentLink.processing_id).toBe(processingAccount.id)
    expect(paymentLink.type).toBe('reusable')
  })

  test('delete payment link reusable', async () => {
    const paymentLink = await paymentLinkReusableFixture(processingAccount)
    await paymentLink.delete()

    await expect(payload.PaymentLink.get(paymentLink.id)).rejects.toThrow(
      payload.NotFound,
    )
  })

  test('delete payment link one time', async () => {
    const paymentLink = await paymentLinkOneTimeFixture(processingAccount)
    await paymentLink.delete()

    await expect(payload.PaymentLink.get(paymentLink.id)).rejects.toThrow(
      payload.NotFound,
    )
  })
})

