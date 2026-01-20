import payload from '../../src/payload'

export function paymentLinkOneTimeFixture(processingAccount) {
  return payload.PaymentLink.create({
    type: 'one_time',
    description: 'Payment Request',
    amount: 10.0,
    processing_id: processingAccount.id,
  })
}

export function paymentLinkReusableFixture(processingAccount) {
  return payload.PaymentLink.create({
    type: 'reusable',
    description: 'Payment Request',
    amount: 10.0,
    processing_id: processingAccount.id,
  })
}

