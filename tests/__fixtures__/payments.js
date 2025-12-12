import payload from '../../src/payload'
import { faker } from '@faker-js/faker'

export function cardPaymentFixture(processingAccount) {
  const amount = faker.finance.amount(10, 100, 2)
  return payload.create(
    payload.Payment({
      processing_id: processingAccount.id,
      amount,
      payment_method: payload.Card({
        card_number: '4242 4242 4242 4242',
        expiry: '12/35',
        card_code: '123',
        billing_address: { postal_code: '11111' },
      }),
    }),
  )
}

export function bankPaymentFixture() {
  const amount = faker.finance.amount(100, 1000, 2)
  return payload.create(
    payload.Payment({
      type: 'payment',
      amount,
      payment_method: payload.BankAccount({
        account_holder: 'First Last',
        account_number: '1234567890',
        routing_number: '036001808',
        account_type: 'checking',
      }),
    }),
  )
}
