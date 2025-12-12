import payload from '../src/payload'
import { processingAccountFixture } from './__fixtures__/accounts'
import { cardPaymentFixture } from './__fixtures__/payments'

describe('Test Transaction', () => {
  let cardPayment
  let proc

  beforeAll(async () => {
    proc = await processingAccountFixture()
    cardPayment = await cardPaymentFixture(proc)
  })

  test('transaction ledger empty', async () => {
    const transaction = await payload
      .select(payload.Transaction)
      .select('*', 'ledger')
      .get(cardPayment.id)

    expect(transaction.ledger).toEqual([])
  })

  test('unified payout batching', async () => {
    await payload.create(
      payload.Refund({
        amount: 10,
        processing_id: proc.id,
        payment_method: payload.Card({
          card_number: '4242 4242 4242 4242',
          expiry: '12/25',
          card_code: '123',
        }),
      }),
    )

    const transactions = await payload
      .select(payload.Transaction)
      .select('*', 'ledger')
      .filterBy({ type: 'refund', processing_id: proc.id })
      .all()

    expect(transactions.length).toBe(1)
    expect(transactions[0].processing_id).toBe(proc.id)
  })

  test('get transactions', async () => {
    const payments = await payload
      .select(payload.Transaction)
      .filterBy({ status: 'processed', type: 'payment' })
      .all()

    expect(payments.length).toBeGreaterThan(0)
  })

  test('risk flag', () => {
    expect(cardPayment.risk_flag).toBe('allowed')
  })

  test('update processed', async () => {
    await cardPayment.update({ status: 'voided' })
    expect(cardPayment.status).toBe('voided')
  })

  test('transactions not found', async () => {
    await expect(payload.Transaction.get('invalid')).rejects.toThrow(
      payload.NotFound,
    )
  })
})
