import { faker } from '@faker-js/faker'
import payload from '../src/payload'
import { processingAccountFixture } from './__fixtures__/accounts'
import { cardPaymentFixture, bankPaymentFixture } from './__fixtures__/payments'

describe('Test Payment Method (V1 API)', () => {
  let processingAccount
  let cardPayment
  let bankPayment

  beforeAll(async () => {
    processingAccount = await processingAccountFixture()
    cardPayment = await cardPaymentFixture(payload, processingAccount)
    bankPayment = await bankPaymentFixture(payload)
  })

  test('create payment card', () => {
    expect(cardPayment.status).toBe('processed')
  })

  test('create payment bank', () => {
    expect(bankPayment.status).toBe('processed')
  })

  test('payment filters', async () => {
    const randDescription = faker.string.alphanumeric(10)

    const newCardPayment = await payload.create(
      payload.Payment({
        amount: 7.50,
        description: randDescription,
        processing_id: processingAccount.id,
        payment_method: payload.Card({
          card_number: '4242 4242 4242 4242',
          expiry: '05/35',
          card_code: '123',
          billing_address: { postal_code: '11111' },
        }),
      }),
    )

    const payments = await payload
      .select(payload.Payment)
      .filterBy(
        payload.Payment.amount.gt(7.49),
        payload.Payment.amount.lt(7.51),
        payload.Payment.description.contains(randDescription),
        payload.Payment.created_at.gt('2019-12-31'),
      )
      .all()

    expect(payments.length).toBe(1)
    expect(payments[0].id).toBe(newCardPayment.id)
  })

  test('void card payment', async () => {
    const payment = await cardPaymentFixture(payload, processingAccount)
    await payment.update({ status: 'voided' })

    expect(payment.status).toBe('voided')
  })

  test('void bank payment', async () => {
    const payment = await bankPaymentFixture(payload)
    await payment.update({ status: 'voided' })

    expect(payment.status).toBe('voided')
  })

  test('refund card payment', async () => {
    const payment = await cardPaymentFixture(payload, processingAccount)
    const refund = await payload.create(
      payload.Refund({
        amount: payment.amount,
        ledger: [payload.Ledger({ assoc_transaction_id: payment.id })],
      }),
    )

    expect(refund.type).toBe('refund')
    expect(refund.amount).toBe(payment.amount)
    expect(refund.status_code).toBe('approved')
  })

  test('partial refund card payment', async () => {
    const payment = await cardPaymentFixture(payload, processingAccount)
    const refund = await payload.create(
      payload.Refund({
        amount: 5.00,
        ledger: [payload.Ledger({ assoc_transaction_id: payment.id })],
      }),
    )

    expect(refund.type).toBe('refund')
    expect(refund.amount).toBe(5.00)
    expect(refund.status_code).toBe('approved')
  })

  test('blind refund card payment', async () => {
    const refund = await payload.create(
      payload.Refund({
        amount: 5.00,
        processing_id: processingAccount.id,
        payment_method: payload.Card({
          card_number: '4242 4242 4242 4242',
          expiry: '12/35',
          card_code: '123',
        }),
      }),
    )

    expect(refund.type).toBe('refund')
    expect(refund.amount).toBe(5.00)
    expect(refund.status_code).toBe('approved')
  })

  test('refund bank payment', async () => {
    const payment = await bankPaymentFixture(payload)
    const refund = await payload.create(
      payload.Refund({
        amount: payment.amount,
        ledger: [payload.Ledger({ assoc_transaction_id: payment.id })],
      }),
    )

    expect(refund.type).toBe('refund')
    expect(refund.amount).toBe(payment.amount)
    expect(refund.status_code).toBe('approved')
  })

  test('partial refund bank payment', async () => {
    const payment = await bankPaymentFixture(payload)
    const refund = await payload.create(
      payload.Refund({
        amount: 5.00,
        ledger: [payload.Ledger({ amount: 5.00, assoc_transaction_id: payment.id })],
      }),
    )

    expect(refund.type).toBe('refund')
    expect(refund.amount).toBe(5.00)
    expect(refund.status_code).toBe('approved')
  })

  test('invalid payment method type invalid attributes', async () => {
    await expect(() =>
      payload.create(
        payload.Transaction({
          type: 'invalid',
          card_number: '4242 4242 4242 4242',
          expiry: '12/35',
        }),
      ),
    ).rejects.toThrow(payload.BadRequest)
  })
})
