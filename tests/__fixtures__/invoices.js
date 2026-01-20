import { format } from 'date-fns'
import payload from '../../src/payload'

export function invoiceFixture(processingAccount, customerAccount) {
  return payload.Invoice.create({
    type: 'bill',
    processing_id: processingAccount.id,
    due_date: format(new Date(), 'yyyy-MM-dd'),
    customer_id: customerAccount.id,
    items: [payload.ChargeItem({ amount: 4.99 })],
  })
}

export function invoiceV2Fixture(session, processingAccount, customerAccount) {
  return session.Invoice.create({
    due_date: format(new Date(), 'yyyy-MM-dd'),
    payer: {
      account_id: customerAccount.id,
    },
    items: [
      session.InvoiceItem({
        type: 'line_item',
        line_item: {
          value: 4.99,
        },
      }),
    ],
  })
}

