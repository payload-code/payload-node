var ARMObject = require('./arm/object')

class AccessToken extends ARMObject {}
AccessToken.__spec__ = {'object': 'access_token'}

class Account extends ARMObject {}
Account.__spec__ = {'object': 'account'}

class Customer extends Account {}
Customer.__spec__ = {'object': 'account',
                     'polymorphic': {'type': 'customer'}}

class ProcessingAccount extends Account {}
ProcessingAccount.__spec__ = {'object': 'account',
                              'polymorphic': {'type': 'processing'}}

class Org extends ARMObject {}
Org.__spec__ = {'endpoint': '/accounts/orgs', 'object': 'org'}

class ProcessingSettings extends Account {}
ProcessingSettings.__spec__ = {'object': 'processing_setting'}

class User extends ARMObject {}
User.__spec__ = {'object': 'user'}

class Transaction extends ARMObject {}
Transaction.__spec__ = {'object': 'transaction'}

class Payment extends Transaction {}
Payment.__spec__ = {'object': 'transaction',
                    'polymorphic': {'type': 'payment'}}

class Refund extends Transaction {}
Refund.__spec__ = {'object': 'transaction',
                    'polymorphic': {'type': 'refund'}}

class Ledger extends ARMObject {}
Ledger.__spec__ = {'object': 'transaction_ledger'}

class PaymentMethod extends ARMObject {}
PaymentMethod.__spec__ = {'object': 'payment_method'}

class Card extends PaymentMethod {}
Card.__spec__ = {'object': 'payment_method',
                 'polymorphic': {'type': 'card'}}

class BankAccount extends PaymentMethod {}
BankAccount.__spec__ = {'object': 'payment_method',
                        'polymorphic': {'type': 'bank_account'}}

class BillingSchedule extends ARMObject {}
BillingSchedule.__spec__ = { 'object': 'billing_schedule' }

class BillingCharge extends ARMObject {}
BillingCharge.__spec__ = { 'object': 'billing_charge' }

class Invoice extends ARMObject {}
Invoice.__spec__ = { 'object': 'invoice' }

class LineItem extends ARMObject {}
LineItem.__spec__ = { 'object': 'line_item' }

class ChargeItem extends LineItem {}
ChargeItem.__spec__ = {'object': 'payment_method',
                       'polymorphic': {'entry_type': 'charge'}}

class PaymentItem extends LineItem {}
PaymentItem.__spec__ = {'object': 'payment_method',
                        'polymorphic': {'entry_type': 'payment'}}

module.exports = {
    AccessToken: AccessToken,
    Account: Account,
    Customer: Customer,
    ProcessingAccount: ProcessingAccount,
    Org: Org,
    ProcessingSettings: ProcessingSettings,
    User: User,
    Transaction: Transaction,
    Ledger: Ledger,
    Payment: Payment,
    Refund: Refund,
    PaymentMethod: PaymentMethod,
    Card: Card,
    BankAccount: BankAccount,
    BillingSchedule: BillingSchedule,
    Invoice: Invoice,
    LineItem: LineItem,
    ChargeItem: ChargeItem,
    PaymentItem: PaymentItem,
}
