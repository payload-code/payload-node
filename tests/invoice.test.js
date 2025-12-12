import { format } from 'date-fns'
import payload from '../src/payload'
import {
  customerFixture,
  processingAccountFixture,
  customerV2Fixture,
  processingAccountV2Fixture,
} from './__fixtures__/accounts'
import { invoiceFixture, invoiceV2Fixture } from './__fixtures__/invoices'

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

describe('Test Invoice (V2 API)', () => {
  let customer
  let processingAccount
  let invoice
  let payloadV2

  beforeAll(async () => {
    payloadV2 = payload.Session(payload.apiKey, { apiVersion: 2 })
    customer = await customerV2Fixture(payloadV2)
    processingAccount = await processingAccountV2Fixture(payloadV2)
    invoice = await invoiceV2Fixture(payloadV2, processingAccount, customer)
  })

  test('create invoice', () => {
    expect(invoice.due_date).toBe(format(new Date(), 'yyyy-MM-dd'))
    expect(invoice.status).toBe('unpaid')
  })

  test('pay invoice', async () => {
    expect(invoice.due_date).toBe(format(new Date(), 'yyyy-MM-dd'))
    expect(invoice.status).toBe('unpaid')

    const bankAccount = payloadV2.BankAccount({
      account_id: customer.id,
      account_holder: 'Test Account Holder',
      account_number: '1234567890',
      routing_number: '036001808',
      account_type: 'checking',
    })
    const bankPaymentMethod = await payloadV2.create(bankAccount)

    if (invoice.status !== 'paid') {
      await payloadV2.create(
        payloadV2.Payment({
          amount: invoice.totals.balance_due,
          type: 'payment',
          sender: {
            method_id: bankPaymentMethod.id,
          },
          invoice_allocations: [{ invoice_id: invoice.id }],
        }),
      )
    }

    const getInvoice = await payloadV2.Invoice.get(invoice.id)
    expect(getInvoice.status).toBe('paid')
  })

  test('delete invoice', async () => {
    const testInvoice = await invoiceV2Fixture(payloadV2, processingAccount, customer)
    await testInvoice.delete()

    await expect(payloadV2.Invoice.get(testInvoice.id)).rejects.toThrow(
      payloadV2.NotFound,
    )
  })
})