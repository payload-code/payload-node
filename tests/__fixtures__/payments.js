import payload from '../../src/payload'
import { faker } from '@faker-js/faker'

function isV2(session) {
  const version = session.defaultHeaders?.['X-API-Version']
  return version === 'v2' || version?.startsWith('v2.')
}

export function cardPaymentFixture(session, processingAccount) {
  const amount = faker.finance.amount(5, 10, 2)
  const isV2Session = isV2(session)

  if (isV2Session) {
    return session.create(
      session.Payment({
        type: 'payment',
        amount,
        sender: {
          method: session.Card({
            card_number: '4242 4242 4242 4242',
            expiry: '12/35',
            card_code: '123',
            billing_address: { postal_code: '11111' },
          }),
        },
        receiver: {
          account_id: processingAccount.id,
        },
      }),
    )
  }

  return session.create(
    session.Payment({
      processing_id: processingAccount.id,
      amount,
      payment_method: session.Card({
        card_number: '4242 4242 4242 4242',
        expiry: '12/35',
        card_code: '123',
        billing_address: { postal_code: '11111' },
      }),
    }),
  )
}

export function bankPaymentFixture(session) {
  const amount = faker.finance.amount(5, 10, 2)
  const isV2Session = isV2(session)

  if (isV2Session) {
    return session.create(
      session.Payment({
        type: 'payment',
        amount,
        sender: {
          method: session.BankAccount({
            account_holder: faker.person.fullName(),
            account_number: '1234567890',
            routing_number: '036001808',
            account_type: 'checking',
          }),
        },
      }),
    )
  }

  return session.create(
    session.Payment({
      type: 'payment',
      amount,
      payment_method: session.BankAccount({
        account_holder: 'First Last',
        account_number: '1234567890',
        routing_number: '036001808',
        account_type: 'checking',
      }),
    }),
  )
}
