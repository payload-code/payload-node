import { format } from 'date-fns'
import payload from '../../src/payload'

export function invoiceFixture(processingAccount, customerAccount) {
  return payload.Invoice.create({
    type: 'bill',
    processing_id: processingAccount.id,
    due_date: format(new Date(), 'yyyy-MM-dd'),
    customer_id: customerAccount.id,
    items: [payload.ChargeItem({ amount: 29.99 })],
  })
}

