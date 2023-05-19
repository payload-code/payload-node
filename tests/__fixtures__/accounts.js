import payload from '../../lib/payload'

export function customerFixture() {
  return payload.create(
    payload.Customer({
      email: 'customer@example.com',
      name: 'Customer Account',
    }),
  )
}

export function processingAccountFixture() {
  return payload.create(
    payload.ProcessingAccount({
      name: 'Processing Account',
      legal_entity: {
        legal_name: 'Test',
        type: 'INDIVIDUAL_SOLE_PROPRIETORSHIP',
        ein: '23 423 4234',
        street_address: '123 Example St',
        unit_number: 'Suite 1',
        city: 'New York',
        state_province: 'NY',
        state_incorporated: 'NY',
        postal_code: '11238',
        phone_number: '(111) 222-3333',
        website: 'https://payload.co',
        start_date: '05/01/2015',
        contact_name: 'Test Person',
        contact_email: 'test.person@example.com',
        contact_title: 'VP',
        owners: {
          full_name: 'Test Person',
          email: 'test.person@example.com',
          ssn: '234 23 4234',
          birth_date: '06/20/1985',
          title: 'CEO',
          ownership: '100',
          street_address: '4455 Carver Woods Drive, Suite 200',
          unit_number: '2408',
          city: 'Cincinnati',
          state_province: 'OH',
          postal_code: '45242',
          phone_number: '(111) 222-3333',
          type: 'owner',
        },
      },
      payment_methods: [
        payload.PaymentMethod({
          type: 'bank_account',
          bank_account: {
            account_number: '123456789',
            routing_number: '036001808',
            account_type: 'checking',
          },
        }),
      ],
    }),
  )
}
