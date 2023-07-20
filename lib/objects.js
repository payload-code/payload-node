/* eslint camelcase: 0 */ // --> OFF

import Armrest from '@armrest/client'

export class AccessToken extends Armrest.Model {}

class ClientToken extends AccessToken {}
ClientToken.__spec__ = {'object': 'access_token',
                    'polymorphic': {'type': 'client'}}

export class Account extends Armrest.Model {}

export class Customer extends Armrest.Model {
  charge(payment) {
    if (typeof payment === 'number') payment = { amount: payment }
    payment.customer_id = this.id
    // eslint-disable-next-line no-use-before-define
    return Payment.create(payment)
  }
}

export class ProcessingAccount extends Armrest.Model {}

export class LegalEntity extends Armrest.Model {
  static spec = { endpoint: '/legal_entities' }
}

export class Org extends Armrest.Model {
  static spec = { endpoint: '/accounts/orgs' }
}

export class ProcessingSettings extends Armrest.Model {}

export class User extends Armrest.Model {}

export class APIKey extends Armrest.Model {}

export class Transaction extends Armrest.Model {}

export class Payment extends Transaction {
  static spec = { object: 'transaction', polymorphic: { type: 'payment' } }
}

export class Refund extends Transaction {
  static spec = { object: 'transaction', polymorphic: { type: 'refund' } }
}

export class Credit extends Transaction {
  static spec = { object: 'transaction', polymorphic: { type: 'credit' } }
}

export class Deposit extends Transaction {
  static spec = { object: 'transaction', polymorphic: { type: 'deposit' } }
}

export class Ledger extends Armrest.Model {
  static spec = { object: 'transaction_ledger' }
}

export class PaymentMethod extends Armrest.Model {}

export class Card extends PaymentMethod {
  static spec = { polymorphic: { type: 'card' } }

  get card_number() {
    return this.card.card_number
  }

  set card_number(card_number) {
    if (!this.card) this.card = {}
    this.card.card_number = card_number
  }

  get expiry() {
    return this.card.expiry
  }

  set expiry(expiry) {
    if (!this.card) this.card = {}
    this.card.expiry = expiry
  }

  get card_code() {
    return this.card.card_code
  }

  set card_code(card_code) {
    if (!this.card) this.card = {}
    this.card.card_code = card_code
  }
}

export class BankAccount extends PaymentMethod {
  static spec = { polymorphic: { type: 'bank_account' } }

  get account_number() {
    return this.bank_account.account_number
  }

  set account_number(account_number) {
    if (!this.bank_account) this.bank_account = {}
    this.bank_account.account_number = account_number
  }

  get routing_number() {
    return this.bank_account.routing_number
  }

  set routing_number(routing_number) {
    if (!this.bank_account) this.bank_account = {}
    this.bank_account.routing_number = routing_number
  }
}

export class BillingSchedule extends Armrest.Model {}

export class BillingCharge extends Armrest.Model {}

export class Invoice extends Armrest.Model {}

export class LineItem extends Armrest.Model {}

export class ChargeItem extends LineItem {
  static spec = { polymorphic: { entry_type: 'charge' } }
}

export class PaymentItem extends LineItem {
  static spec = { polymorphic: { entry_type: 'payment' } }
}

export class PaymentLink extends Armrest.Model {}

export class AppSettings extends Armrest.Model {
  static spec = { endpoint: '/app_settings' }
}

export class Webhook extends Armrest.Model {}

export class WebhookLog extends Armrest.Model {}

export class PaymentActivation extends Armrest.Model {}
