import { format } from 'date-fns'
import payload from '../src/payload'
import { customerFixture, processingAccountFixture } from './__fixtures__/accounts'
import { invoiceFixture } from './__fixtures__/invoices'

describe('Test Invoice', () => {
  let cust
  let proc
  let invoice

  beforeAll(async () => {
    cust = await customerFixture()
    proc = await processingAccountFixture()
    invoice = await invoiceFixture(proc, cust)
  })

  test('create invoice', () => {
    expect(invoice.due_date).toBe(format(new Date(), 'yyyy-MM-dd'))
    expect(invoice.status).toBe('unpaid')
  })

  test('pay invoice', async () => {
    expect(invoice.due_date).toBe(format(new Date(), 'yyyy-MM-dd'))
    expect(invoice.status).toBe('unpaid')

    const card = payload.Card({
      account_id: cust.id,
      card_number: '4242 4242 4242 4242',
      expiry: '12/35',
      card_code: '123',
      billing_address: { postal_code: '11111' },
    })
    const cardPayment = await payload.create(card)

    if (invoice.status !== 'paid') {
      await payload.create(
        payload.Payment({
          amount: invoice.amount_due,
          customer_id: cust.id,
          payment_method_id: cardPayment.id,
          allocations: [payload.PaymentItem({ invoice_id: invoice.id })],
        }),
      )
    }

    const getInvoice = await payload.Invoice.get(invoice.id)
    expect(getInvoice.status).toBe('paid')
  })

  test('delete invoice', async () => {
    const testInvoice = await invoiceFixture(proc, cust)
    await testInvoice.delete()

    await expect(payload.Invoice.get(testInvoice.id)).rejects.toThrow(
      payload.NotFound,
    )
  })
})

