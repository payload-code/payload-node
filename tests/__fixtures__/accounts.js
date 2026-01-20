import { faker } from '@faker-js/faker'
import payload from '../../src/payload'

export function customerFixture() {
  return payload.create(
    payload.Customer({
      email: faker.internet.email(),
      name: faker.person.fullName(),
    }),
  )
}

export function processingAccountFixture() {
  const contactName = faker.person.fullName()
  const contactEmail = faker.internet.email()
  const ownerName = faker.person.fullName()
  const ownerEmail = faker.internet.email()

  return payload.create(
    payload.ProcessingAccount({
      name: faker.company.name(),
      legal_entity: {
        legal_name: faker.company.name(),
        type: 'INDIVIDUAL_SOLE_PROPRIETORSHIP',
        country: 'US',
        ein: faker.finance.routingNumber(),
        street_address: faker.location.streetAddress(),
        unit_number: faker.location.secondaryAddress(),
        city: faker.location.city(),
        state_province: faker.location.state({ abbreviated: true }),
        state_incorporated: faker.location.state({ abbreviated: true }),
        postal_code: faker.location.zipCode(),
        phone_number: faker.phone.number('(###) ###-####'),
        website: faker.internet.url(),
        start_date: '05/01/2015',
        contact_name: contactName,
        contact_email: contactEmail,
        contact_title: faker.person.jobTitle(),
        owners: {
          full_name: ownerName,
          email: ownerEmail,
          ssn: faker.finance.routingNumber(),
          birth_date: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toLocaleDateString('en-US'),
          title: faker.person.jobTitle(),
          ownership: '100',
          street_address: faker.location.streetAddress(),
          unit_number: faker.location.secondaryAddress(),
          city: faker.location.city(),
          state_province: faker.location.state({ abbreviated: true }),
          postal_code: faker.location.zipCode(),
          phone_number: faker.phone.number('(###) ###-####'),
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

export function customerV2Fixture(session) {
  return session.create(
    session.Account({
      type: 'customer',
      name: faker.person.fullName(),
      contact_details: {
        email: faker.internet.email(),
      },
    }),
  )
}

export function processingAccountV2Fixture(session) {
  const contactName = faker.person.fullName()
  const contactEmail = faker.internet.email()

  return session.create(
    session.Account({
      type: 'processing',
      name: faker.company.name(),
      entity: {
        type: 'business',
        legal_name: faker.company.name(),
        country: 'US',
        tax_id: { value: faker.finance.routingNumber() },
        address: {
          address_line_1: faker.location.streetAddress(),
          address_line_2: faker.location.secondaryAddress(),
          city: faker.location.city(),
          state_province: faker.location.state({ abbreviated: true }),
          postal_code: faker.location.zipCode(),
        },
        phone_number: faker.phone.number('###-###-####'),
        business: {
          category: 'real_estate',
          structure: 'llc',
          website: faker.internet.url(),
          formation: { state_province: faker.location.state({ abbreviated: true }), date: '2019-10-01' },
          primary_contact: {
            name: contactName,
            email: contactEmail,
          },
        },
      },
      processing: {
        default_category: 'real_estate',
      },
    }),
  )
}
