import payload from '../../src/payload'

export function billingScheduleFixture(customer, processingAccount) {
  return payload.create(
    payload.BillingSchedule({
      start_date: '2019-01-01',
      end_date: '2019-12-31',
      recurring_frequency: 'monthly',
      type: 'subscription',
      customer_id: customer.id,
      processing_id: processingAccount.id,
      charges: payload.BillingCharge({
        type: 'option_1',
        amount: 39.99,
      }),
    }),
  )
}

export function billingScheduleV2Fixture(session, customer, processingAccount) {
  return session.create(
    session.BillingSchedule({
      start_date: '2019-01-01',
      end_date: '2019-12-31',
      recurring_schedule: {
        type: 'daily',
      },
      payer: {
        account_id: customer.id,
      },
      biller: {
        account_id: processingAccount.id,
      },
      items: [
        session.BillingItem({
          type: 'line_item',
          line_item: {
            value: 39.99,
            value_units: 'number',
            qty: 1,
          },
        }),
      ],
    }),
  )
}

